# Helper script to start the react frontend on localhost.
# Loads secrets and then kicks off ng serve.

# Example usage
# ./ng-serve--hmr.ps1

# Ensure we are in location where the current ps1 is physically stored.
Set-Location $PSScriptRoot

# Load secrets into the local powershell enviro session...
& "C:\sensitive\rwasp-gcp\load-secrets.ps1"

# Kick off ng serve with HMR
Write-Host 'npm run dev' -ForegroundColor Magenta
npm run dev
