# Пазарче – site files

Upload everything in this folder to a GitHub repository, then link that repository to your Netlify site
(Netlify → Site configuration → Build & deploy → Continuous deployment → Link repository).
No build command is needed; the publish folder (`public`) is read from `netlify.toml`.

```
netlify.toml                  Netlify settings (publish folder, headers)
public/index.html             the marketplace (Macedonian, Albanian, English; phone-friendly)
public/help|safety|privacy|terms|contact.html   info pages in 3 languages (made by gen/pages.py)
public/admin.html             admin panel (open /admin.html, log in with your admin account)
public/icon*.png, icon.svg    app icons (add to home screen)
public/manifest.webmanifest   app manifest
netlify/functions/listing.mjs   builds the Google-readable page for /oglas/<id>
netlify/functions/sitemap.mjs   builds /sitemap.xml
netlify/functions/robots.mjs    builds /robots.txt
netlify/functions/keepalive.mjs pings Supabase daily so the free project is not paused

Database: run migration-4.sql once in Supabase (lets users delete their own account).
Contact e-mail on the info pages: edit CONTACT_EMAIL in gen/pages.py and re-run it, or search the 5 pages for YOUR-EMAIL@example.com.
```

The Supabase address and publishable key are near the top of `public/index.html`, `public/admin.html`
and the two functions that talk to the database. Never put the `service_role` / secret key in any of them.

## Migrations (run in Supabase → SQL Editor, in order, once each)
migration-2 … migration-6. Newest: `migration-5.sql` (subcategories, ad types, price options, WhatsApp/Viber, video, views) and `migration-6.sql` (saved searches). Run them BEFORE deploying the matching index.html.
