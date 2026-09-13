<<<<<<< HEAD
# DEADLINE-OS
=======
# DeadlineOS AI

DeadlineOS AI is a full-stack student planning application for tracking assignments, estimating workload, prioritising deadlines, and generating study schedules.

## Features

- Email and password authentication
- Protected dashboard, timeline, assignments, analytics, and assignment-detail routes
- Assignment planning interface with priorities, deadlines, progress, and status
- Priority calculation and schedule-generation utilities
- AI service structure for workload estimation, assignment analysis, and subtask generation
- CSV and PDF export utilities
- File-storage-ready assignment schema

> **Project status:** the authentication client is connected to Supabase, while several screens (including the assignments list and dashboard metrics) still use mock data. The server API currently exposes placeholder assignment and planner routes.

## Tech stack

- **Client:** React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query
- **Server:** Node.js, Express, TypeScript
- **Current backend service:** Supabase Auth, PostgreSQL, and Storage
- **Planning:** Custom priority and scheduling algorithms

## Project structure

```text
.
|- client/                  # React/Vite frontend
|  `- src/
|     |- components/        # UI, layout, dashboard, timeline, and auth components
|     |- hooks/             # Authentication and demo hooks
|     |- pages/             # Application routes
|     `- lib/               # Supabase browser client
|- server/                  # Express API and planning logic
|  `- src/
|     |- algorithms/        # Priority engine and scheduler
|     |- controllers/       # Planner controller
|     |- middleware/        # Authentication middleware
|     `- services/          # AI-related services
|- supabase/
|  `- migrations/           # PostgreSQL schema and RLS policies
`- .env.example             # Required environment variables
```

## Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project (for the current implementation)

## Installation

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd WEBSITE
   ```

2. Install dependencies for the root project, client, and server.

   ```bash
   npm install
   npm run install:all
   ```

3. Create `.env` in the project root using `.env.example` as the template.

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=your-openai-key
   PORT=5000
   VITE_API_URL=http://localhost:5000
   ```

   Never commit `.env`, `SUPABASE_SERVICE_ROLE_KEY`, or `OPENAI_API_KEY`. The service-role key belongs only on the server.

## Database setup (Supabase)

1. Create a Supabase project.
2. In **Authentication > Providers**, enable Email authentication.
3. In **SQL Editor**, run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
4. In **Storage**, create a private bucket named `assignment-files`.
5. Add the three Supabase variables to `.env`.
6. Start the project and create a user at `/signup`. The database trigger automatically creates the corresponding `profiles` record.

The migration creates these tables:

- `profiles`
- `assignments`
- `subtasks`
- `schedule_blocks`
- `study_sessions`
- `user_availability`
- `ai_recommendations`
- `planning_runs`

Row Level Security (RLS) policies limit users to their own records. Subtask access is enforced through the parent assignment.

## Running locally

Run both the client and server:

```bash
npm run dev
```

- Client: Vite prints its local URL, usually `http://localhost:5173`
- Server health check: `http://localhost:5000/health`

Run either service individually:

```bash
npm run dev:client
npm run dev:server
```

Create a production build:

```bash
npm run build
```

## API routes

| Method | Route | Current behavior |
| --- | --- | --- |
| `GET` | `/health` | Returns server status |
| `GET` | `/api/assignments` | Placeholder assignments response |
| `GET` | `/api/planner` | Placeholder planner response |

The planner controller contains schedule generation logic, but its routes still need to be wired into `server/src/index.ts` and secured with the authentication middleware before production use.

## Firebase migration note

Firebase has not yet been integrated into the codebase. If you migrate from Supabase, replace the Supabase client/auth middleware with Firebase Authentication, Firestore, Firebase Storage, and Firebase Admin; then update the environment variables and Firestore rules. Do not mix Supabase and Firebase credentials in production.

## Next development steps

1. Replace mock assignment and dashboard data with database queries.
2. Implement assignment CRUD, subtasks, schedules, and study-session persistence.
3. Wire authenticated planner endpoints into Express.
4. Add input validation and tests for API routes.
5. Configure production CORS, environment secrets, and deployment.

## License

This project is private and does not currently include a license.
>>>>>>> 50dfecc (Initial commit)
