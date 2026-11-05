# Verification — 5 November 2026

## Passed

- `npm run typecheck` — TypeScript completed without errors.
- `npm run build` — production compilation, type checking and route generation passed. Public CMS pages are dynamic; `/admin` is in a separate layout branch.
- `npm test` — 9 tests passed (4 source/package checks and 5 behavioral validation tests).
- `npm audit` — 0 known vulnerabilities with the supplied lockfile. Vercel Blob is pinned to 2.4.0 to avoid advisories reported in the latest SDK dependency chain during this session.
- `npm run test:e2e -- --grep-invert 'public navigation'` — 8 integration tests passed against the built production application and disposable PGlite database.

Integration coverage: anonymous admin rejection; public chrome absent on the admin login response; successful login; rejected cross-origin mutation; expired session rejection; logout revocation; owner/editor permissions; content persistence; escaped script-like policy/FAQ text; SEO updates; audit records; invalid image uploads; enquiry validation and persistence; security response headers; service/price changes; published articles; product listings; strict boolean validation; and five-attempt login lockout. New coverage verifies international WhatsApp number validation, the button on 13 public routes and its absence in admin, contact fallback/visibility settings, owner-only admin creation/deletion, password confirmation, duplicate emails, self-deletion protection, password hashing, session revocation and audit entries.

Image validation tests decode and re-encode a real generated JPEG, verify WebP output and EXIF removal, and reject oversized, mislabeled, SVG and corrupt inputs.

## Attempted but not verified

The browser test was attempted with installed Chrome. The desktop execution sandbox prevented Chrome startup (Crashpad/bootstrap permission denied, SIGABRT). No browser assertion ran successfully. Therefore visual appearance, mobile overflow, keyboard focus, computed reduced-motion behavior, and full admin/browser form interactions are **unverified**. The browser test remains included for a normal development machine. The implemented CSS, semantics and rendering checks do not replace that review.

Native local PostgreSQL startup was also blocked by shared-memory restrictions. Integration tests use a PostgreSQL-compatible PGlite fixture with a one-connection application pool to avoid its multiplexed-protocol limitation. This does not certify the target hosted PostgreSQL provider, TLS, backup recovery or migration behavior on existing production data.

No production secrets or database were read or modified. No live Vercel Blob credentials were used. A valid upload to the actual cloud store, authorization failures from the storage provider, retrieval after redeploy, object/database backup recovery, and actual Vercel deployment/HTTPS behavior remain unverified. Complete the staging checklist in UPDATE_SETUP.md before launch.

The source was copied from Downloads into this workspace; the original Downloads folder was not changed. The delivery ZIP excludes dependencies, build output, local environment files, test artifacts and secrets.

## Copy-over update

The copy-over ZIP includes the complete updated src directory, tests and handoff notes. It excludes every .env file and does not change package.json, package-lock.json or the database schema. No new dependency, environment variable or migration is required for this incremental update. The WhatsApp number default remains blank. CMS fields now have named page/section groups rather than raw source keys. Existing database content is preserved.
