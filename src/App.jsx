import { Footer, Header } from './components.jsx'
import { routeFromPath } from './site.js'
import Home from './pages/Home.jsx'
import { AllFeaturesPage, FeaturesPage } from './pages/Features.jsx'
import DownloadPage from './pages/Download.jsx'
import { ChangelogPage, IssuesPage } from './pages/Community.jsx'
import { DocPage, DocsIndexPage, GUIDES } from './pages/Docs.jsx'

export { ROUTES, getPageMeta } from './site.js'

function Page({ route }) {
  if (route === '/features/') return <FeaturesPage />
  if (route === '/features/all/') return <AllFeaturesPage />
  if (route === '/download/') return <DownloadPage />
  if (route === '/changelog/') return <ChangelogPage />
  if (route === '/issues/') return <IssuesPage />
  if (route === '/docs/') return <DocsIndexPage />
  if (GUIDES.some((g) => g.route === route)) return <DocPage route={route} />
  return <Home />
}

/** Each route is pre-rendered to its own HTML file, so links are plain page loads. */
export default function App({ route: prerenderRoute }) {
  const route = prerenderRoute || routeFromPath(window.location.pathname)
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header route={route} />
      <main id="main">
        <Page route={route} />
      </main>
      <Footer />
    </>
  )
}
