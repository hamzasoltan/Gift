# Gift Website — Starter Scaffold

Starter project for the Gift brand website. This is **Phase 1 (project structure + initial UI scaffold)**, not the complete production website. No external accounts are connected and no live deployment has been performed.

## Stack
- Next.js App Router + TypeScript
- JSON files for editable services, portfolio records, archive, and site settings
- Vercel deployment target
- GitHub repository as the content source of truth
- Cloudinary planned for public image delivery; Google Drive planned for originals/archive

## Requirements
- Node.js 20.9+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Current scaffold
- `app/page.tsx`: first-pass Arabic homepage sections
- `app/globals.css`: Gift dark-mode tokens and responsive layout based on Gift Design System v1.0
- `data/services.json`: four initial service records
- `data/portfolio.json`: placeholder draft only; replace with real Gift work before launch
- `data/archive.json`: archive data placeholder
- `data/site.json`: WhatsApp number and social links
- `types/content.ts`: TypeScript content types
- `.env.example`: names of expected environment variables only; no secrets

## Important implementation notes
1. The admin interface and server-side GitHub write API are **not implemented yet**.
2. Do not put a GitHub token, Cloudinary API secret, session secret, or password in client-side code or committed files.
3. Use Cloudinary signed uploads generated server-side or a restricted unsigned upload preset with appropriate constraints. Never expose `CLOUDINARY_API_SECRET` in browser code.
4. GitHub writes should use the file SHA/version to prevent overwriting newer content. Add authentication, rate limiting, CSRF protections where applicable, input validation, secure cookies, and audit logging before exposing admin routes.
5. `metadataBase` currently uses a placeholder Vercel URL; update it after the actual deployment URL is known.
6. The language and theme controls are visual placeholders and are disabled until their behavior is implemented.
7. Real product images, final Arabic/English copy, Google Analytics ID, and Search Console verification are still needed.
8. Google Drive share URLs may not behave as direct, performant image URLs. Keep Drive for original/archive and use Cloudinary delivery URLs in the public JSON.

## Suggested next phases
1. Finalize homepage design with the supplied logo and real images.
2. Implement language switching (`ar`/`en`) and persistent theme toggle.
3. Build secure admin authentication and server-side JSON read/write endpoints.
4. Integrate Cloudinary upload and GitHub compare-and-swap writes.
5. Add archive/restore, downloadable JSON backups, validation, and failure handling.
6. Add analytics/consent handling, SEO details, and test the production build.
