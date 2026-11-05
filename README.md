# Updated CMS release

Start with [UPDATE_SETUP.md](UPDATE_SETUP.md) for this update, environment variables, migration and image uploads. Read [TEST_RESULTS.md](TEST_RESULTS.md) for verified checks and remaining limits. The original project notes follow.

# PetRock Veterinary — Vercel deployment package

Full website and owner CMS for a small veterinary practice in Akure, Ondo State, aligned with the approved ₦195,000 proposal. No payment gateway, medical record system or automatic appointment confirmation is claimed. Appointment requests are enquiries until staff confirm them.

## Included
- Responsive homepage, services and dedicated detail pages, About, Contact, booking requests, pharmacy listings and blog.
- Server-persisted contact/appointment requests, enquiry status tracking.
- Separate `/admin/login` for owner/staff, dashboard for enquiries, services, blog posts, pharmacy listings, website details, audit log.
- Password hashing (scrypt), 12-hour HttpOnly session cookies, lockout after five failed logins, database-backed rate limiting, server authorization, input validation, origin checks and security headers.
- Plain-text articles intentionally avoid unsafe HTML; no untrusted file uploads or third-party tracking.

## Fresh installation
1. Install Node.js 20.9+ and create a Neon PostgreSQL database.
2. Copy `.env.example` to `.env.local`, fill `DATABASE_URL`, `SESSION_SECRET` (64+ random characters), and `SITE_URL`.
3. `npm install`
4. `npm run db:init` (environment variables must be exported into the shell; Node scripts do not load `.env.local` automatically). Example: `set -a; source .env.local; set +a; npm run db:init` (avoid shell history exposure of credentials).
5. Create the initial owner account from a trusted terminal, NOT a public signup page: `ADMIN_EMAIL='owner@example.com' ADMIN_PASSWORD='strong-unique-password' npm run admin:create`. `DATABASE_URL` must be available in that shell.
6. `npm run dev`; visit `http://localhost:3000/admin/login` to sign in and update verified business details.

## Vercel deployment
1. Push the source to a **private** Git repository, excluding all `.env` files.
2. Import into Vercel, set `DATABASE_URL`, `SESSION_SECRET`, `SITE_URL=https://your-real-domain` in Vercel project environment variables.
3. Run database initialization and owner account creation from a trusted terminal against the **production** database. Never run owner setup through a public endpoint.
4. Deploy. Confirm actual contact details, service descriptions, prices, and legal policies with the business before launch.
5. Test the full checklist in `LAUNCH_CHECKLIST.md` on the production URL.

## Important operational limitations
- No payment processing, medical record storage, image upload, staff invitation, or live video system. Pharmacy is an enquiry-only catalogue, not a prescription checkout.
- Blog posts are plain text; upload-free design reduces storage costs and security risk. Existing visuals use CSS/illustrative symbols, not client-supplied photography.
- The business must provide a real phone number, clinic address, verified emergency hours, policies and clinical credentials before public launch.
- Free tiers may have commercial-use restrictions, quotas and billing changes. Check Vercel and database provider terms.
- The project has not been verified in a real Vercel environment by this package alone. Production deployment, database testing, independent security review, backups and privacy review remain mandatory.
- For production email notifications, integrate an approved provider; current enquiries are stored in the admin dashboard and require staff to check it.

## Security and privacy
Review `SECURITY.md` and `LAUNCH_CHECKLIST.md`. Do not store production secrets in Git. The admin URL is not advertised publicly, but authorization is enforced on the server. Legal pages contain draft language requiring business review. Only collect information necessary to respond to enquiries.
