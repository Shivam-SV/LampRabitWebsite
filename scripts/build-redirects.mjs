// The site has moved to Cloudflare. This builds a redirect-only dist/ for GitHub Pages: every old
// route gets a page that sends visitors (and search engines, via canonical + meta refresh) to the
// same path on the new site, keeping the query string and #hash. Unknown paths go through 404.html,
// which redirects to the same path too, so deep links into guides keep working.
//
// NEW_SITE_URL (repository Actions variable) is the new site's address, e.g. https://lamprabit.dev/
import fs from 'node:fs/promises'
import path from 'node:path'

const target = (process.env.NEW_SITE_URL || '').replace(/\/?$/, '/')
if (!/^https:\/\//.test(target)) {
  console.error('build-redirects: set NEW_SITE_URL (e.g. https://lamprabit.dev/) in Settings → Secrets and variables → Actions → Variables.')
  process.exit(1)
}

// Old route → new route (only /issues/ moved).
const ROUTES = {
  '/': '/',
  '/features/': '/features/',
  '/features/all/': '/features/all/',
  '/download/': '/download/',
  '/changelog/': '/changelog/',
  '/issues/': '/community/',
  '/docs/': '/docs/',
  '/docs/installation/': '/docs/installation/',
  '/docs/faq/': '/docs/faq/',
  '/docs/migrate-from-xampp/': '/docs/migrate-from-xampp/',
  '/docs/migrate-from-laragon/': '/docs/migrate-from-laragon/',
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const page = (to, script) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LampRabit has moved</title>
<link rel="canonical" href="${escape(to)}">
<meta http-equiv="refresh" content="0; url=${escape(to)}">
<script>${script}</script>
<style>body{font:17px/1.6 system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 16px;color:#1b2028}a{color:#0d7f57}</style>
</head>
<body>
<h1>LampRabit has moved</h1>
<p>The website is now at <a href="${escape(to)}">${escape(to)}</a>.</p>
</body>
</html>
`

const keepQueryAndHash = (to) => `location.replace(${JSON.stringify(to)} + location.search + location.hash)`

// 404.html: map whatever path was asked for (minus the repo sub-path) onto the new site.
const notFound = `var base = '/LampRabitWebsite/';
var p = location.pathname.indexOf(base) === 0 ? location.pathname.slice(base.length) : location.pathname.replace(/^\\//, '');
if (p === 'issues/' || p === 'issues') p = 'community/';
location.replace(${JSON.stringify(target)} + p + location.search + location.hash)`

const dist = path.join(process.cwd(), 'dist')
await fs.rm(dist, { recursive: true, force: true })
for (const [from, to] of Object.entries(ROUTES)) {
  const url = new URL(to.replace(/^\//, ''), target).href
  const dir = path.join(dist, from)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'index.html'), page(url, keepQueryAndHash(url)))
}
await fs.writeFile(path.join(dist, '404.html'), page(target, notFound))
await fs.writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n')

// Search Console ownership file: keep it so the property stays verified during the move.
for (const file of await fs.readdir('public')) {
  if (/^google[0-9a-f]+\.html$/.test(file)) await fs.copyFile(path.join('public', file), path.join(dist, file))
}
console.log(`build-redirects: ${Object.keys(ROUTES).length} routes now redirect to ${target}`)
