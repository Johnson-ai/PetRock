# PetRock CMS update

## Install and run

Use Node 20.9+ (tested with Node 24). Run `npm ci`, copy `.env.example` to `.env.local`, and set `DATABASE_URL` to a PostgreSQL connection string with production TLS enabled as required by your provider. Set `SITE_URL` to your canonical HTTPS domain. Keep secrets out of Git and ZIP files.

Run migrations against a backup/staging database first. `node --env-file=.env.local scripts/init-db.mjs` is idempotent: it creates the new media table and preserves existing records and settings. Create an initial owner using `ADMIN_EMAIL` and `ADMIN_PASSWORD` with `node --env-file=.env.local scripts/create-admin.mjs`. Use a unique password of at least 12 characters. Run `npm run dev`, or `npm run build` followed by `npm start`.

## Persistent image storage

In the Vercel project, create/connect a **public Vercel Blob store**. Add its `BLOB_READ_WRITE_TOKEN` to local `.env.local` and the appropriate Vercel deployment environments. Never prefix this token with NEXT_PUBLIC_. Configure `DATABASE_URL` and `SITE_URL` in Vercel too, then redeploy. The upload endpoint uses the Node runtime. No upload is stored on Vercel's ephemeral local filesystem.

Open `/admin` directly; there is no public admin link. In Public content, upload JPEG, PNG or WebP images up to 4 MB and provide an image description. Files are decoded with a pixel cap, re-encoded to WebP, resized within 2000×2000, and stripped of EXIF metadata. SVG and animated uploads are rejected. A failed database write triggers blob cleanup. Uploaded photos are public: upload approved website imagery, never private patient documents. Postgres stores the library and placements. Back up the database and Blob store together; keep object URLs stable.

Choose a homepage, service, post or product image slot and click a library photo, then Save public content. Article/product image slots appear after creating those records. The initial dog/cat photos are local starter photography, replaceable through this library. Upload validation is local-tested; a real cloud upload, persistence after redeploy, and permission failures must be verified with your own store before launch.

## Editing public content

Website settings controls business details, hero wording and announcements. Public content controls page copy, policy text, form labels, navigation/footer link lists, FAQ entries, SEO title/descriptions and image descriptions. Search by page name or wording. Navigation/footer links and FAQ entries have add/remove controls; invalid structure and unsafe links are rejected server-side. Empty image placement removes that image. Text is plain text, including policy and article paragraphs; HTML is escaped. Line breaks are preserved in policy text and detailed descriptions. Owners publish global content; editors manage services, posts, products and enquiry statuses and may upload library images. Only approved published posts and active services appear publicly.

Keep full URLs out of navigation lists: internal routes begin with `/`. Available image slots include hero, feature, service-{slug}, post-{slug}, product-{id}. Prices live in Services/Pharmacy. Article titles and excerpts provide record content, with separate SEO overrides in Public content. All public routes render dynamically so changes appear on the next request. Homepage section copy is indexed under `page.tsx.*`, shared branding/footer under `layout.tsx.*`. Layout and visual styles remain source-controlled.

## Validation

`npm run typecheck`, `npm test`, `npm run build`, `npm audit`.

For isolated browser checks: `npx playwright install chromium`, then `npm run test:e2e` after building. Tests use an in-memory PostgreSQL-compatible PGlite database on port 55440 and the production app on port 3100. Their hardcoded accounts/passwords exist only in the disposable test fixture; no production database or credentials are used. Do not expose test servers on public interfaces. Run equivalent staging checks against your actual PostgreSQL provider before deployment.

## Launch and privacy operations

Approve all copy, prices, clinic contact details and images. Confirm emergency hours directly. Have the business approve policy wording, retention periods and Nigerian legal obligations before launch. Existing draft policies are editable and must reflect actual operations. No payment or optional analytics integration is included; payment/refund/webhook rules are therefore not applicable.

For a verified personal-data deletion request, an authorized database operator must locate the corresponding enquiry by confirmed identity and remove it using a parameterized query; retain only records required by approved legal obligations. Include backups in the retention schedule. Set and document an actual retention period with the business; this update does not invent one or silently delete existing enquiries. Restrict database and Blob dashboard access and rotate credentials when staff leave. Audit entries contain action/record identifiers, not copies of enquiry messages.

Before launch, verify real PostgreSQL transactions, Vercel deployment, HTTPS cookies, object-store upload/read after redeploy, backup recovery, real form delivery into the CMS, login lockout, owner/editor access, keyboard operation and mobile layout. Do not mark cloud checks complete based solely on local tests.

## Starter photography

Dog: https://images.unsplash.com/photo-1552053831-71594a27632d
Cat: https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba
These are illustrative companion photographs, not clinic patients, staff or testimonials. Files are served locally; the public site makes no request to Unsplash or Google Fonts.
