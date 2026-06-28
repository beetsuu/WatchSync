# WatchSync

A watch party tracker to manage series, turns and episodes with friends.

## Tech Stack

- ASP.NET Core 8 Web API
- Entity Framework Core + PostgreSQL
- React + TypeScript + Vite
- Tailwind CSS

## Setup

### Prerequisites
- Docker Desktop
- .NET 8 SDK
- Node.js (LTS)

### Backend
1. Start Docker Desktop
2. Start PostgreSQL container:
docker run --name watchsync-db -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=watchsync -p 5432:5432 -d postgres
3. Navigate to `WatchSync.Api`:
cd WatchSync.Api
4. Apply migrations:
dotnet ef database update
5. Start the API:
dotnet run

Swagger UI available at: `https://localhost:7202/swagger`

### Frontend
1. Navigate to `watchsync-frontend`:
cd watchsync-frontend
2. Install dependencies:
npm install
3. Start dev server:
npm run dev

App runs at: `http://localhost:5173`

## Status
 ---In development---