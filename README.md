# lampRabit website

A responsive React and Vite website for lampRabit, a free and open-source local PHP development environment. It is statically pre-rendered for search crawlers and deployed with GitHub Pages.

## Run locally

```bash
npm ci
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

The build pre-renders every route into HTML and generates `sitemap.xml` and `robots.txt`. The product documentation is sourced from `src/content/`, copied from `LampRabit/docs/website/` in the desktop app repository.

## GitHub Pages

1. Push this project to a GitHub repository.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. The workflow deploys on pushes to `main` and derives the site URL and project path from the repository name.

For a custom domain, add repository Actions variables `SITE_URL` (for example `https://lamprabit.dev/`) and `PUBLIC_PATH` (usually `/`). Set the matching custom domain in Pages and configure DNS. The workflow uses relative paths for generated assets, so both project pages and custom domains work.

## Downloads and releases

The download and changelog pages read public releases from `Shivam-SV/LambRabit`. Installer links appear when a release includes platform assets (`.exe` / `.msi`, `.dmg` / `.pkg`, `.AppImage` / `.deb` / `.rpm`). Until then, the site clearly marks installers as coming soon and links to GitHub Releases. Do not publish unverified or placeholder installer URLs.

If the desktop app moves to a different repository, update `REPO` in `src/App.jsx` and the repository URL in `scripts/prerender.mjs`.