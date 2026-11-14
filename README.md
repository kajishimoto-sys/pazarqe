# Пазарче – site files

Upload everything in this folder to a GitHub repository, then link that repository to your Netlify site
(Netlify → Site configuration → Build & deploy → Continuous deployment → Link repository).
No build command is needed; the publish folder (`public`) is read from `netlify.toml`.

```
netlify.toml                  Netlify settings (publish folder, headers)
public/index.html             the marketplace (Macedonian, Albanian, English; phone-friendly)
public/admin.html             admin panel (open /admin.html, log in with your admin account)
public/icon*.png, icon.svg    app icons (add to home screen)
public/manifest.webmanifest   app manifest
netlify/functions/listing.mjs   builds the Google-readable page for /oglas/<id>
netlify/functions/sitemap.mjs   builds /sitemap.xml
netlify/functions/robots.mjs    builds /robots.txt
```

The Supabase address and publishable key are near the top of `public/index.html`, `public/admin.html`
and the two functions that talk to the database. Never put the `service_role` / secret key in any of them.
