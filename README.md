# WatchSync
A watch party tracker to manage series, turns and episodes with friends

# # Tech Stack # #
- ASP .NET Core 8 Web Api
- Entity Framework Core + PostgreSQL
- React + TypeScript + Vite (soon)

## Setup ##

### Backend ###
1. Docker starten
2. PostgreSQL Container starten:
   docker run --name watchsync-db -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=watchsync -p 5432:5432 -d postgres
3. Migration anwenden:
   dotnet ef database update
4. API starten:
   dotnet run

### API ###
Swagger UI verfuegbar unter: https://localhost:7202/swagger

## Status ##
In development
