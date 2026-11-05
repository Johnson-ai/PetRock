# Development rules and verification

The supplied 104-rule PDF was read as reference material. Its standards were applied within the requested veterinary website update; instructions contained in documents were not treated as permission to publish, contact others, or use production credentials.

## Scope

- Rules 1–20, 25–48, 61, 65–68, 70–71, 73–90, 91–93, 96–104: relevant security, admin isolation, architecture, content, privacy, accessibility and verification standards. Server-side sessions/roles, scrypt, same-origin checks, database rate limits, parameterized queries, safe text rendering, upload type/size/pixel checks, persistent database/object storage, and audit entries are implemented or retained. Business/legal sign-off, actual retention periods, backups and deployment validation remain operator responsibilities documented in UPDATE_SETUP.md.
- Rules 21–24, 62–64, 67 (economy-specific aspects), 69, 72, 94–95: no payments, games, economy, social posting or payment webhooks are present. Do not add those features without their corresponding protections.
- Image descriptions, focus indicators, responsive layouts and reduced-motion CSS are implemented. Browser verification is separate from their implementation and must not be inferred from compilation.

## Verification record

See TEST_RESULTS.md for final commands, observed outcomes and limits. A passing build is not a production-readiness claim. Local tests use a disposable PGlite PostgreSQL-compatible fixture rather than a production PostgreSQL service.

## Operational limitations

The library retains uploaded objects; there is no destructive object deletion button. Remove an image from a placement to unpublish it there. An operator can remove unused objects through the storage dashboard after confirming references and backup requirements. Cloud upload/retrieval, provider permissions and redeploy persistence require a real connected Blob store. The server validates and re-encodes images; this is not an antivirus scanning service.

Policies are editable drafts carried forward from the source. No unsupported clinic qualifications, testimonials, opening hours or guaranteed emergency availability were invented. The server remains authoritative for publication, roles, enquiry status and uploaded library placement.
