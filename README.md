# lampRabit website

The website for [lampRabit](https://github.com/Shivam-SV/LampRabit), a free and open-source local PHP development environment. React + Vite, pre-rendered to static HTML for every route, deployed to GitHub Pages.

## Run locally

```bash
npm ci
npm run dev        # http://localhost:5173/LampRabitWebsite/
```

## Build and preview

```bash
npm run build      # sync guides, build, pre-render every route
npm run preview    # http://localhost:4173/LampRabitWebsite/
```

`npm run build` does three things:

1. **Syncs the guides** (`scripts/sync-content.mjs`): downloads `docs/website/*.md` from the app repository's `main` branch into `src/content/`. Edit guides **in the app repository**, not here; this copy is overwritten on every build. If GitHub can't be reached, the existing copies are used.
2. Builds the site with Vite.
3. **Pre-renders** every route in `src/site.js` into its own `index.html` (`scripts/prerender.mjs`), with titles, descriptions, Open Graph tags, structured data, `sitemap.xml`, `robots.txt` and a `404.html`.

## Structure

| Path | What's there |
|---|---|
| `src/site.js` | Repository links, routes, page titles and descriptions, link helpers |
| `src/github.js` | Live data from the GitHub API: latest release, all releases, open issues; installer matching; OS detection |
| `src/components.jsx` | Header, footer, logo, screenshot frame, markdown renderer, page intro |
| `src/pages/` | Home, Features (+ full list), Download, Changelog and Issues, Guides |
| `src/style.css` | The whole design system: tokens, type scale, layout, components |
| `src/content/` | Guides synced from the app repository (don't edit here) |
| `public/screenshots/` | App screenshots (1280×860, taken from the running app) |

To add a page: add its route and meta in `src/site.js`, render it in `src/App.jsx`, and link it from the header or footer in `src/components.jsx`.

## Live data

The Download, Changelog and Issues pages read from the GitHub API in the visitor's browser, so new releases and issues appear without rebuilding the site. Installers are matched by file name (`x64-setup.exe`, `.msi`, `aarch64.dmg`, `x64.dmg`, `.deb`, `.AppImage`). If the API can't be reached (for example GitHub's limit of 60 requests an hour per visitor), the pages link to GitHub instead.

## Design rules

- Body text is 17px; nothing is smaller than 13px. Use the `--fs-*` variables, not new sizes.
- Brand colours come from the app: charcoal `#1b2028`, mint `#59d1a2`. Green text on white uses `--green` (`#0d7f57`) for contrast.
- Content must be visible without JavaScript or animation.
- Keep platform claims honest: Windows is fully supported; macOS and Linux are a preview until Apache, Nginx and PHP downloads exist there.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`. In **Settings → Pages**, the source must be **GitHub Actions**.

For a custom domain later, set the repository Actions variables `SITE_URL` (for example `https://lamprabit.dev/`) and `PUBLIC_PATH` (`/`), then configure the domain in Pages and DNS.
