$ErrorActionPreference = "Stop"

# Configuration Variables
$ProjectId = "rwasp-gcp"
$Region = "australia-southeast2" # Melbourne
$RepoName = "rwasp-gcp-docker-repo"
$ServiceName = "rwasp-app"
$SqlInstanceName = "rwasp-sql-instance"
$DatabaseName = "rwasp_gcp_db"
$BucketName = "rwasp-gcp-userpics"

# Secrets File (not in repo)
$SecretsFile = "$HOME\sensitive\rwasp-gcp\secrets.md"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " GCP Redeploy Script" -ForegroundColor Cyan
Write-Host " Project ID: $ProjectId" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Parse required secrets
Write-Host "`nReading secrets from $SecretsFile..."
$DbPassword = $null
$GoogleClientId = $null
$GoogleClientSecret = $null

if (-not (Test-Path $SecretsFile)) {
    Write-Error "Secrets file not found at $SecretsFile!"
    exit 1
}

$secretsContent = Get-Content $SecretsFile
$matchDb = $secretsContent | Select-String -Pattern "^DB_PASSWORD=(.*)$"
$matchGClientId = $secretsContent | Select-String -Pattern "^GOOGLE_CLIENT_ID=(.*)$"
$matchGSecret = $secretsContent | Select-String -Pattern "^GOOGLE_CLIENT_SECRET=(.*)$"

if ($matchDb) { $DbPassword = $matchDb.Matches.Groups[1].Value.Trim() }
if ($matchGClientId) { $GoogleClientId = $matchGClientId.Matches.Groups[1].Value.Trim() }
if ($matchGSecret) { $GoogleClientSecret = $matchGSecret.Matches.Groups[1].Value.Trim() }

if ([string]::IsNullOrWhiteSpace($DbPassword) -or [string]::IsNullOrWhiteSpace($GoogleClientId) -or [string]::IsNullOrWhiteSpace($GoogleClientSecret)) {
    Write-Error "Missing required secrets (DB_PASSWORD, GOOGLE_CLIENT_ID, or GOOGLE_CLIENT_SECRET) in $SecretsFile."
    exit 1
}

# 2. Build the database connection string
# 2. Fetch the SQL Public IP and build connection string
Write-Host "Fetching Cloud SQL public IP..."
$SqlIp = gcloud sql instances describe $SqlInstanceName --format="value(ipAddresses[0].ipAddress)"
if ([string]::IsNullOrWhiteSpace($SqlIp)) {
    Write-Error "Could not fetch SQL IP. Is the instance running?"
    exit 1
}
$ConnectionString = "Server=$SqlIp;Database=$DatabaseName;User Id=sqlserver;Password=$DbPassword;TrustServerCertificate=True;MultipleActiveResultSets=true"

# 3. Create image tag
$ImageTag = "$Region-docker.pkg.dev/$ProjectId/$RepoName/rwasp-image:latest"

Write-Host "`n[1/2] Submitting build to Google Cloud Build..." -ForegroundColor Green
$RootPath = Resolve-Path "$PSScriptRoot\.."
gcloud builds submit "$RootPath" --tag $ImageTag

if ($LASTEXITCODE -ne 0) {
    Write-Error "Cloud Build failed!"
    exit 1
}

Write-Host "`n[2/2] Deploying image to Cloud Run..." -ForegroundColor Green
# We deploy and pass all the necessary environment variables securely
gcloud run deploy $ServiceName --image $ImageTag --region $Region --allow-unauthenticated --set-env-vars="ConnectionStrings__StoreContext=$ConnectionString,Authentication__Google__ClientId=$GoogleClientId,Authentication__Google__ClientSecret=$GoogleClientSecret,GCP__StorageBucketName=$BucketName,RUN_MIGRATIONS=true"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nRedeploy complete!" -ForegroundColor Cyan
    $Url = gcloud run services describe $ServiceName --region $Region --format="value(status.url)"
    Write-Host "Your app is live at: $Url" -ForegroundColor Green
} else {
    Write-Error "Cloud Run deploy failed!"
}

