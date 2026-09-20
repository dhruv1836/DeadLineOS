# DeadlineOS AI

DeadlineOS AI is a full-stack student planning application for tracking assignments, estimating workload, prioritising deadlines, and generating study schedules.

## Stack

- Client: React, TypeScript, Vite, Tailwind CSS, React Router
- Server: Node.js, Express, TypeScript
- Data and auth: Supabase Auth, PostgreSQL, and Storage
- Analysis: `pdf-parse` with optional OpenAI structured extraction

## Setup

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run install:all
```

Create a root `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
PORT=5000
VITE_API_URL=http://localhost:5000
CLIENT_ORIGINS=http://localhost:5173
```

Keep `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` on the server only. The PDF analyzer works without `OPENAI_API_KEY` by using deterministic text extraction, but AI-quality analysis requires the key.

Apply `supabase/migrations/001_initial_schema.sql` to the Supabase project. It creates the private `assignment-files` bucket and per-user Storage policies. Uploaded files must use the path `<auth-user-id>/<generated-file-name>`; the server enforces this path.

## Supabase firewall and connection

1. Create a Supabase project and copy its URL from **Project Settings > API**.
2. Enable **Authentication > Providers > Email**.
3. In **SQL Editor**, run the migration file. Do not expose the service-role key in the client.
4. In the root `.env`, set `VITE_SUPABASE_URL`, `SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`. Set `SUPABASE_SERVICE_ROLE_KEY` only for the server.
5. Set `VITE_API_URL=http://localhost:5000` and `CLIENT_ORIGINS=http://localhost:5173` locally. In production, replace them with the deployed client and API origins, comma-separated if needed.
6. In Supabase **Settings > Database > Network Restrictions**, allow only the fixed public egress IP of the deployed server. Leave local development unrestricted or add your current public IP temporarily.
7. In **Authentication > URL Configuration**, set the production Site URL and add the client URL to Redirect URLs.
8. Start the API and check `http://localhost:5000/health`, then start the client and sign up. Assignment requests use the Supabase access token automatically.

The API CORS allowlist is the application firewall. Supabase RLS is the data firewall: users can read and write only their own rows and files. Never put `SUPABASE_SERVICE_ROLE_KEY` in `client/.env` or any `VITE_*` variable.

## Run

```bash
npm run dev
```

The client runs on the Vite URL, usually `http://localhost:5173`, and the server runs on `http://localhost:5000`.

Build both packages with:

```bash
npm run build
```

## API

Authenticated routes require `Authorization: Bearer <supabase-access-token>`.

| Method | Route | Behavior |
| --- | --- | --- |
| `GET` | `/health` | Server health status |
| `GET` | `/api/assignments` | List the authenticated user's assignments and subtasks |
| `POST` | `/api/assignments` | Create an assignment and optional subtasks |
| `PATCH` | `/api/assignments/:id` | Update an owned assignment |
| `DELETE` | `/api/assignments/:id` | Delete an owned assignment |
| `POST` | `/api/assignments/analyze-pdf` | Analyze one PDF in multipart field `file`, max 10 MB |
| `POST` | `/api/planner` | Generate and persist a schedule |
| `POST` | `/api/planner/replan` | Recalculate and persist a schedule |

The PDF endpoint extracts readable text, detects assignment metadata and requirements, and uses OpenAI structured output when configured. Scanned image-only PDFs need OCR before they can be analyzed.

## Project layout

```text
client/       React application
server/       Express API, auth middleware, AI services, and planning algorithms
supabase/     Database schema and RLS migration
```
