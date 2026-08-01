# Publications 8

Modern replacement for the Publications app.

## Structure

- `core/` — Fastify REST API, Google OAuth, Drizzle/PostgreSQL persistence, and serverless Chromium PDF generation.
- `web/` — React, TypeScript, and Vite client.

During development, run Fastify on port `4004` and Vite on port `5173`. Vite proxies `/api`, `/oauth2`, and `/login` to Fastify so the browser uses one effective origin and session cookies work normally.

See [core/README.md](core/README.md) for backend setup and API details.

## Deploying to Vercel

The repository is configured as a Vercel Services project. `web` deploys as a
Vite service and `core` deploys as a native Fastify function on Fluid compute.
Vercel routes the API and Google OAuth paths to Fastify under the same public
domain as the web app.

In the Vercel project settings, select **Services** as the framework and add:

- `DATABASE_URL` — Neon's pooled PostgreSQL connection URL.
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` — `https://your-domain/login/oauth2/code/google`
- `FRONTEND_URL` — `https://your-domain`
- `CORS_ALLOWED_ORIGIN` — `https://your-domain`
- `SESSION_SECRET` — at least 32 cryptographically random characters
- `SESSION_COOKIE_SECURE` — `true`

The default maximum database pool size is five connections per warm function
instance and can be changed with `DATABASE_MAX_POOL_SIZE`.

Register the same production callback URL in the Google Cloud OAuth client.
Dynamic Vercel preview domains will not be able to complete Google OAuth unless
their callback URLs are also explicitly registered.
