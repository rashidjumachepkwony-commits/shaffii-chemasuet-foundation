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
npm run lint          # ESLint src/
npm run worker:typecheck  # TypeScript typecheck for Worker
```

#### Worker Configuration
- `worker/wrangler.toml` — Cloudflare Worker config with ASSETS binding
- The `[assets]` section serves `dist/` as static assets
- `binding = "ASSETS"` is required in wrangler.toml
- `compatibility_date = "2024-11-18"` (needed for ASSETS feature)

#### Environment Variables
- `ENVIRONMENT` — "development" (default) or "production"
- In development mode, admin endpoints are accessible without auth
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for Supabase

#### Key Patterns
- Middleware (CORS, security headers) applies to `/api/*` routes only
- Static assets served via `c.env.ASSETS` in the catch-all `app.get("*")` handler
- SPA fallback: 404 from ASSETS → serve `index.html`
- Form hook: `useForm` in `src/hooks/useForm.ts` with Zod validation

#### Important Files
- `src/pages/public/support/RequestSupport.tsx` — Support request form with cascading location dropdowns
- `src/lib/locations.ts` — Kenya administrative divisions data (counties → sub-counties → wards → locations)
- `src/contexts/AuthContext.tsx` — Auth context with login, register, logout, resetPassword, refreshSession, updateProfile
- `src/services/index.ts` — API service layer
