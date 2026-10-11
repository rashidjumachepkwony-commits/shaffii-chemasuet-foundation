# AGENTS.md - Project Guide for Kilo

## Project: Shafie Chemasuet Foundation

### Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + lucide-react
- **Backend/API**: Cloudflare Worker (Hono) + Supabase
- **Deployment**: Single Cloudflare Worker serving both frontend and API

### Commands

#### Build & Deploy
```bash
# Build frontend and deploy Worker (serves both frontend + API)
npm run deploy

# Build frontend only
npm run build

# Deploy Worker only (requires frontend already built to dist/)
npm run worker:deploy

# Local development (API + frontend via Vite)
npm run dev
npm run worker:dev
```

#### Lint & TypeCheck
```bash
npm run lint             # ESLint src/ (slow on cold start — allow 2+ min)
npx tsc --noEmit --skipLibCheck   # Frontend typecheck (use --skipLibCheck, it's much faster)
npm run worker:typecheck # TypeScript typecheck for Worker
```

### Environment Variables

#### Frontend (`.env`, must use `VITE_` prefix — safe to expose in browser)
- `VITE_APP_ENV` — **`"development"` enables the mock dev session; anything else
  (e.g. `"production"`) uses real auth. NEVER detect dev mode from hostname —
  `*.workers.dev` hosts are real deployments and must use real login.
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` — Worker URL. Defaults to same-origin `/api` when unset.

#### Worker
- `worker/wrangler.toml` — `[vars] ENVIRONMENT = "production"` by default. The
  `dev` environment (`wrangler deploy --env development`) sets `"development"`,
  which enables the server-side dev bypass in `middleware/auth.ts`.
- `worker/.dev.vars` — local secrets for `npm run worker:dev`. Copy
  `SUPABASE_URL` and set `SUPABASE_SERVICE_ROLE_KEY` from the Supabase dashboard.
- Production secrets are set via `wrangler secret put SUPABASE_URL` /
  `wrangler secret put SUPABASE_SERVICE_ROLE_KEY`.

### Key Patterns

#### Auth (single-step login + token refresh)
- `src/contexts/AuthContext.tsx` is the auth source of truth. Sessions persist to
  `localStorage` under `scf-auth-session` / `scf-auth-user`.
- Login is ONE step: `authService.login()` returns `user`, `session`, `profile`,
  `role`, and `permissions`. Admin pages check `role` from the returned data —
  no separate `/auth/verify-admin` round-trip.
- `src/services/api.ts` registers an unauthorized handler via
  `setUnauthorizedHandler`. On any `401` it calls the handler (which refreshes
  the access token) and retries the request exactly once. Auth endpoints in
  `AUTH_WHITELIST` are excluded to prevent refresh loops.
- Token refresh: worker `POST /api/auth/refresh` with `{ refresh_token }`
  → new `access_token`, `refresh_token`, `expires_at`.
- Password reset uses token verification, NOT a live session:
  worker `POST /api/auth/reset-password` (send email) then
  `POST /api/auth/reset-password/confirm` with the recovery `access_token`
  from the email link's URL hash.
- Admin password updates use `supabase.auth.admin.updateUserById(id, {...})`.
  There is no `admin.updateUser` — do not use it.

#### Data access
- The worker owns ALL privileged data access via the service-role client
  (`worker/src/services/supabase.ts`). The browser never sees the service key.
- `src/lib/supabase.ts` (browser anon client) is **unused dead code** — the app
  goes through the Worker API instead. Don't add new code that depends on it.

#### Routes (worker, `worker/src/routes/*`)
- Public (no auth): `POST /api/support`, `POST /api/contact`, `GET /api/events*`,
  `GET /api/news*`, `GET /api/public/settings`, `GET /api/public/content`
- Auth-gated: `POST /api/auth/refresh`, `GET /api/auth/me`, `GET /api/dashboard`
- Permission-gated (via `requirePermission`): everything under `/api/admin/*`,
  including `/api/admin/content` for content sections.

#### Response shape
- Single: `{ success: true, data }`
- Paginated: `{ success: true, data, meta: { page, limit, total, totalPages } }`
- Frontend unwraps with `extractData()` from `src/services/api.ts`.
- Types are defined twice: `src/types/index.ts` and `worker/src/types/index.ts`.
  **When you change a type, update BOTH files.**

### Important Files
- `src/contexts/AuthContext.tsx` — login, logout, token refresh, dev bypass
- `src/services/api.ts` — fetch wrapper, token provider, 401 retry-once logic
- `src/pages/admin/Login.tsx` — single-step admin login + role gate
- `src/pages/admin/ContentSections.tsx` — CMS for website content sections
- `worker/src/routes/content.ts` — public + admin content section CRUD
- `supabase/migrations/015_content_sections.sql` — content_sections table
- `src/lib/locations.ts` — Kenya administrative divisions (counties → wards).
  Each county key must be UNIQUE — duplicate keys are a TS error.

### Route Registration
Every new worker route must be registered in `worker/src/index.ts`:
`app.route("/api/<path>", router)`. Public content routes go under
`/api/public/content`; admin ones under `/api/admin/content`.

### Frontend Routes
Admin routes live inside a `RequireAuthOutlet` with
`roles={["SUPER_ADMIN", "ADMIN", "EVENT_MANAGER", "CONTENT_MANAGER"]}` and are
wrapped by `LazyAdminLayout`. There is exactly ONE route block per path — do
not duplicate route definitions.
