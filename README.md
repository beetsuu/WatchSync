# WatchSync

A watch party tracker where friends track which movies, anime and series they're watching together, with a turn-based episode system — each person watches a set amount of episodes before passing the turn.

**🔗 Live:** [radpour.dev](https://radpour.dev)
**💻 GitHub:** [github.com/beetsuu/WatchSync](https://github.com/beetsuu/WatchSync)

## Features

- JWT authentication with registration and login
- Create and manage multiple watch parties
- Invite friends via shareable invite codes
- Add shows with cover images and episode counts
- Track current episode with +1/−1 controls
- Turn-based watch system with configurable episode limits per turn
- Automatic turn switching with warnings at the limit
- Switch between watch parties via dropdown
- Responsive design for desktop and mobile

## Tech Stack

**Backend:** ASP.NET Core 8 Web API, Entity Framework Core, ASP.NET Core Identity, JWT Authentication, PostgreSQL 16

**Frontend:** React, TypeScript, Vite, Tailwind CSS

**Infrastructure:** Self-hosted on a Linux VPS (Debian) with Docker, deployed via Coolify, HTTPS via Let's Encrypt, nginx with SPA routing

## Architecture


```
watchsync.radpour.dev (Frontend)
        │
        ▼
  api.radpour.dev (Backend API)
        │
        ▼
    PostgreSQL 16 (Database)
```


The frontend is a static React build served by nginx with SPA routing. The backend is a containerized ASP.NET Core API using multi-stage Docker builds. Authentication uses ASP.NET Core Identity with JWT tokens. Both run on the same server, orchestrated by Coolify, with Traefik as reverse proxy handling TLS termination.

## Running Locally

### Prerequisites
- Docker Desktop
- .NET 8 SDK
- Node.js (LTS)

### Backend
```bash
# Start PostgreSQL
docker run --name watchsync-db -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=watchsync -p 5432:5432 -d postgres:16

# Navigate to backend
cd WatchSync.Api

# Apply migrations and start
dotnet ef database update
dotnet run
```
API available at: `https://localhost:7202/swagger`

### Frontend
```bash
cd WatchSyncFrontend
npm install
npm run dev
```
App runs at: `http://localhost:5173`

## Roadmap

- [x] Authentication (JWT with ASP.NET Core Identity)
- [x] User registration and login
- [x] Multi-watch-party selection
- [x] Invite system with shareable codes
- [x] Personal default watch party on registration
- [x] Member management within watch parties
- [ ] Watch history / activity feed
- [ ] Loading and error states


## Credits

Show metadata and images are provided by the TVMaze API.

https://www.tvmaze.com/api
