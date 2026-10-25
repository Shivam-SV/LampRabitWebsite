export const REPO = 'Shivam-SV/LambRabit'
export const REPO_URL = `https://github.com/${REPO}`
export const RELEASES_URL = `${REPO_URL}/releases`
export const LATEST_URL = `${RELEASES_URL}/latest`
export const ISSUES_URL = `${REPO_URL}/issues`
export const NEW_BUG_URL = `${ISSUES_URL}/new?template=bug_report.yml`
export const NEW_IDEA_URL = `${ISSUES_URL}/new?template=feature_request.yml`
export const API = `https://api.github.com/repos/${REPO}`

// Vite's base: "/LampRabitWebsite/" on GitHub Pages, "/" on a custom domain.
export const BASE = import.meta.env.BASE_URL

/** Internal link for a route like "/features/". */
export const href = (route) => `${BASE}${route.replace(/^\//, '')}`

/** Asset in public/, e.g. asset('screenshots/sites.png'). */
export const asset = (file) => `${BASE}${file}`

export const ROUTES = [
  '/', '/features/', '/features/all/', '/download/', '/changelog/', '/issues/',
  '/docs/', '/docs/installation/', '/docs/faq/', '/docs/migrate-from-xampp/', '/docs/migrate-from-laragon/',
]

const META = {
  '/': ['lampRabit: local PHP development, without the setup', 'A free, open-source XAMPP and Laragon alternative. Apache or Nginx, PHP, MariaDB and developer tools in one desktop app. Drop a folder into www and open it at https://yourapp.test.'],
  '/features/': ['Features · lampRabit', 'Automatic .test sites with trusted HTTPS, a PHP version per site, Apache and Nginx, PHP extensions, Mailpit, phpMyAdmin, tunnels, logs and diagnostics.'],
  '/features/all/': ['Complete feature list · lampRabit', 'Every lampRabit feature, with availability and platform notes.'],
  '/download/': ['Download · lampRabit', 'Download lampRabit for Windows. macOS and Linux builds are available as a preview.'],
  '/changelog/': ['Changelog · lampRabit', 'Release notes and installers for every lampRabit version.'],
  '/issues/': ['Issues and ideas · lampRabit', 'See what people are reporting and asking for, and report a bug or suggest a feature on GitHub.'],
  '/docs/': ['Guides · lampRabit', 'Install lampRabit, move from XAMPP or Laragon, and find answers to common questions.'],
  '/docs/installation/': ['Installation · lampRabit', 'System requirements, installing on Windows, macOS and Linux, first run, HTTPS and building from source.'],
  '/docs/faq/': ['FAQ and troubleshooting · lampRabit', 'Answers about .test domains, HTTPS, PHP versions, MariaDB, Mailpit, logs and common service errors.'],
  '/docs/migrate-from-xampp/': ['Move from XAMPP · lampRabit', 'Move your PHP projects and MariaDB databases from XAMPP to lampRabit, step by step.'],
  '/docs/migrate-from-laragon/': ['Move from Laragon · lampRabit', 'Move your sites and databases from Laragon to lampRabit and keep your .test domains.'],
}

export function getPageMeta(route) {
  const [title, description] = META[route] || META['/']
  return { title, description }
}

/** The route for a browser path, accounting for the base path. */
export function routeFromPath(pathname) {
  let path = pathname.startsWith(BASE) ? `/${pathname.slice(BASE.length)}` : pathname
  path = path.replace(/index\.html$/, '')
  if (!path.endsWith('/')) path += '/'
  return ROUTES.includes(path) ? path : '/'
}
