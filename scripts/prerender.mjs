import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')
const siteRoot = (process.env.VITE_SITE_URL || 'https://shivam-sv.github.io/LampRabitWebsite/').replace(/\/?$/, '/')

const vite = await createServer({
  configFile: path.join(rootDir, 'vite.config.js'),
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const { default: App, ROUTES, getPageMeta } = await vite.ssrLoadModule('/src/App.jsx')
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  const routes = ROUTES
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteRoot}#organization`,
        name: 'lampRabit',
        url: siteRoot,
        logo: `${siteRoot}lamprabit-mark.svg`,
        sameAs: [`https://github.com/Shivam-SV/LambRabit`],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteRoot}#website`,
        name: 'lampRabit',
        url: siteRoot,
        publisher: { '@id': `${siteRoot}#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'lampRabit',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows 10 or later (macOS 11+ and Linux in preview)',
        description: 'A free, open-source desktop environment for local PHP development with Apache or Nginx, PHP, MariaDB, local HTTPS, and developer tools.',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: siteRoot,
        codeRepository: 'https://github.com/Shivam-SV/LambRabit',
      },
    ],
  }

  for (const route of routes) {
    const meta = getPageMeta(route)
    const markup = renderToString(React.createElement(App, { route }))
    const routePath = route === '/' ? '' : route.replace(/^\/+|\/+$/g, '')
    const outDir = path.join(distDir, routePath)
    await fs.mkdir(outDir, { recursive: true })
    const canonical = new URL(routePath ? `${routePath}/` : '', siteRoot).toString()
    const routeSchema = route.startsWith('/docs/') && route !== '/docs/'
      ? { '@context': 'https://schema.org', '@graph': [...schemaGraph['@graph'].slice(0, 2), { '@type': 'TechArticle', headline: meta.title, description: meta.description, mainEntityOfPage: canonical, publisher: { '@id': `${siteRoot}#organization` }, inLanguage: 'en' }] }
      : schemaGraph
    const headExtras = [
      `<link rel="canonical" href="${canonical}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="lampRabit">`,
      `<meta property="og:title" content="${meta.title.replaceAll('"', '&quot;')}">`,
      `<meta property="og:description" content="${meta.description.replaceAll('"', '&quot;')}">`,
      `<meta property="og:url" content="${canonical}">`,
      `<meta property="og:image" content="${siteRoot}screenshots/overview-dark.png">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:image" content="${siteRoot}screenshots/overview-dark.png">`,
      `<meta name="twitter:title" content="${meta.title.replaceAll('"', '&quot;')}">`,
      `<meta name="twitter:description" content="${meta.description.replaceAll('"', '&quot;')}">`,
      `<script type="application/ld+json">${JSON.stringify(routeSchema).replace(/</g, '\\u003c')}</script>`,
    ].join('\n    ')
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${meta.description.replaceAll('"', '&quot;')}">`)
      .replace('</head>', `    ${headExtras}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    await fs.writeFile(path.join(outDir, 'index.html'), html)
  }

  // GitHub Pages serves 404.html for unknown paths; the home page is the friendliest fallback.
  await fs.copyFile(path.join(distDir, 'index.html'), path.join(distDir, '404.html'))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${new URL(route.replace(/^\/+/, ''), siteRoot).toString()}</loc></url>`).join('\n')}\n</urlset>\n`
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap)
  await fs.writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteRoot).toString()}\n`)
  console.log(`Pre-rendered ${routes.length} routes and generated sitemap.xml / robots.txt.`)
} finally {
  await vite.close()
}
