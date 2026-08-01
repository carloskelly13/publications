# Publications Core

TypeScript and Fastify REST backend for Publications. It uses Drizzle with PostgreSQL, Google OAuth with PKCE, database-backed sessions, CSRF protection, and Puppeteer with serverless Chromium for pixel-faithful PDF output from the web app's SVG.

## Local setup

1. Create the local PostgreSQL database and role.
2. Copy `.env.example` to `.env` and fill in the values. Git ignores `.env`.
3. In Google Cloud Console, register `http://localhost:4004/login/oauth2/code/google` as an authorized redirect URI.
4. Run `npm install` and `npm run dev`.

The API runs at `http://localhost:4004`. Start login at `/oauth2/authorization/google`. OpenAPI is available at `/v3/api-docs`; regenerate the web app's aliases with `npm run generate:api` from `web` while the API is running.

Sessions are stored in PostgreSQL. The browser receives only a signed opaque cookie, so authentication remains valid when Vercel scales the function down or handles a request on another instance.

## REST API

| Method   | Route                             | Purpose                                                  |
| -------- | --------------------------------- | -------------------------------------------------------- |
| `GET`    | `/api/auth/csrf`                  | Return the current session's CSRF header name and token. |
| `GET`    | `/api/auth/current-user-identity` | Return the current Google-backed user.                   |
| `POST`   | `/api/auth/logout`                | Delete the current session.                              |
| `GET`    | `/api/documents?page=0&size=4`    | List the user's documents with pagination.               |
| `POST`   | `/api/documents`                  | Create a document.                                       |
| `GET`    | `/api/documents/{id}`             | Read one owned document.                                 |
| `PUT`    | `/api/documents/{id}`             | Replace an owned document.                               |
| `PATCH`  | `/api/documents/{id}`             | Rename an owned document.                                |
| `DELETE` | `/api/documents/{id}`             | Delete an owned document.                                |
| `POST`   | `/api/documents/{id}/pdf`         | Render submitted SVG as a PDF.                           |

Mutating requests send the CSRF value in the `X-XSRF-TOKEN` header. Chromium runs with JavaScript disabled and external requests blocked while rendering PDFs.
