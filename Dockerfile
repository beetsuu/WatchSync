# ---- Build-Stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

#.csproj kopieren und Pakete laden
COPY WatchSync.Api/WatchSync.Api.csproj WatchSync.Api/
RUN dotnet restore WatchSync.Api/WatchSync.Api.csproj

# Restlichen Code kopieren und veröffentlichen
COPY . .
RUN dotnet publish WatchSync.Api/WatchSync.Api.csproj -c Release -o /app/publish

# ---- Runtime-Stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Im Container nur HTTP auf Port 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "WatchSync.Api.dll"]