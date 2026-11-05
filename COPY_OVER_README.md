# Copy-over update — PetRock Veterinary

This update is for the PetRock CMS project delivered earlier in this chat. It adds WhatsApp contact links, an organized content editor, and owner-managed admin accounts.

## Apply it

1. Stop your running development server with Control+C. Keep a backup of your current src folder.
2. Replace only your project's **src** folder with the complete **src** folder included here. Put it beside your existing package.json.
3. Optionally replace tests and copy playwright.config.ts if you want the updated test suite.
4. Run `npm run dev` in your existing project.

Keep your current .env.local exactly where it is. This ZIP has no environment files. Your existing Neon DATABASE_URL, database records, admin login and Blob token are retained. No npm install, database reset or migration is needed for this incremental update; its dependencies and database tables already exist in the previously delivered CMS release.

## In admin

- Public content now opens a page/section workspace: Homepage, Other pages, Header & footer, FAQs, Policies, Enquiry forms, Search previews, Images, and Clinic & WhatsApp. Search finds content across sections. Only changed fields are saved. Image uploads preserve unsaved text edits.
- Open **Public content → Clinic & WhatsApp**, or **Website settings**, to enter your WhatsApp number with its country code (for example +234…). The number is deliberately blank by default. Until you add it, the floating button opens Contact us. You can edit the label and prefilled message or hide the floating button. Visitors send the message themselves.
- WhatsApp is available across public pages and stays out of admin. Contact includes call and map links when real clinic details have been supplied; the footer uses your saved contact details/hours.
- Owners have an **Administrators** tab to create Owner/Editor accounts and remove other accounts. Confirm changes with your current password. You cannot remove yourself or the last owner. Deletion revokes the removed account's sessions and creates an audit entry. Password hashes never appear in the account list.

## Verification

Typecheck, production build, 9 checks and 8 server integration tests passed. The desktop sandbox blocks Chrome startup, so browser visual, keyboard and mobile checks remain unverified. Actual WhatsApp account registration/app handoff, live object storage and the deployed Neon/Vercel environment still need your staging checks. See TEST_RESULTS.md.

Reference formats: [WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934) and [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
