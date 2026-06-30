# WatchSync

A watch party tracker where friends track which anime and series they're watching together, with a turn-based episode system — each person watches 13 episodes before passing the turn.

**🔗 Live:** [watchsync.radpour.dev](https://watchsync.radpour.dev)
**📡 API:** [api.radpour.dev/api](https://api.radpour.dev/api/shows)

## Features

- Add and manage shows with cover images and episode counts
- Track current episode with +1/−1 controls
- Turn-based watch system: 13 episodes per person before switching
- Watch party groups with member management
- Turn limit warnings and boundary checks (disabled at 0 and max)
- User switching via arrow navigation

## Tech Stack

**Backend:** ASP.NET Core 8 Web API, Entity Framework Core, PostgreSQL 16
**Frontend:** React 18, TypeScript, Vite, Tailwind CSS
**Infrastructure:** Self-hosted on a Linux VPS (Debian) with Docker, deployed via Coolify, HTTPS via Let's Encrypt

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

The frontend is a static React build served by nginx with SPA routing. The backend is a containerized ASP.NET Core API using multi-stage Docker builds. Both run on the same server, orchestrated by Coolify, with Traefik as reverse proxy handling TLS termination.

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

- [ ] Authentication (JWT)
- [ ] User registration and login
- [ ] Multi-watch-party selection
- [ ] Watch history / activity feed
- [ ] Loading and error states
