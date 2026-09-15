# ==========================================
# STAGE 1: Build the React Frontend (Vite)
# ==========================================
FROM node:20 AS build-client
WORKDIR /app/reactwithasp.client

# Copy package.json and install dependencies
COPY reactwithasp.client/package*.json ./
RUN npm install

# Copy frontend source and build it
COPY reactwithasp.client/ ./
RUN npm run build

# ==========================================
# STAGE 2: Build the .NET 8 Backend
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-server
WORKDIR /app

# Copy the solution and project files first to cache NuGet restore
COPY *.sln ./
COPY ReactWithASP.Server/ReactWithASP.Server.csproj ReactWithASP.Server/
COPY reactwithasp.client/reactwithasp.client.esproj reactwithasp.client/

# Restore NuGet dependencies
RUN dotnet restore "ReactWithASP.Server/ReactWithASP.Server.csproj"

# Copy the rest of the backend source code
COPY ReactWithASP.Server/ ReactWithASP.Server/

# Publish the .NET app
WORKDIR /app/ReactWithASP.Server
RUN dotnet publish "ReactWithASP.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false /p:NoClientBuild=true

# Copy the compiled React files (from STAGE 1) into the published wwwroot
COPY --from=build-client /app/reactwithasp.client/dist /app/publish/wwwroot

# ==========================================
# STAGE 3: Final Runtime Image
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Expose ports (Cloud Run uses the PORT environment variable, usually 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:${PORT:-8080}

# Copy the final published output from Stage 2
COPY --from=build-server /app/publish .

# Tell the container what command to run on startup
ENTRYPOINT ["dotnet", "ReactWithASP.Server.dll"]
