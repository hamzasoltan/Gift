# Gift Website

Next.js App Router + TypeScript website. Public content is stored in JSON files in GitHub and deployed through Vercel.

## Admin panel

- URL path: `/gift-control-panel`. The path is not a security boundary; password authentication is required.
- Edits `data/site.json`, `data/services.json`, and `data/portfolio.json`.
- Saving commits the selected JSON file to GitHub; Vercel should redeploy when GitHub integration is connected.
- Uses an expiring HMAC-signed HttpOnly cookie, secure in production, SameSite=Strict, and same-origin checks for state-changing requests.
- Admin page is marked noindex.

### Required Vercel environment variables

Configure these in Vercel Project Settings → Environment Variables for Production, then redeploy:

- `ADMIN_PASSWORD`: unique password of at least 12 characters.
- `ADMIN_SESSION_SECRET`: random secret of at least 32 characters.
- `GITHUB_TOKEN`: fine-grained token limited to this repository with Contents read/write permission.
- `GITHUB_OWNER=hamzasoltan`
- `GITHUB_REPO=Gift`
- `GITHUB_BRANCH=main`

Never use `NEXT_PUBLIC_*` for secrets or commit credentials to GitHub.

## Limitations and next steps

- The admin panel is implemented but not usable until the Vercel secrets above are configured and tested.
- First version edits raw JSON rather than visual form fields.
- Cloudinary uploads, durable rate limiting, audit trail, backups/restore, and production end-to-end tests are not yet implemented.
- Portfolio still contains placeholder sample work; replace it with real Gift photos.
