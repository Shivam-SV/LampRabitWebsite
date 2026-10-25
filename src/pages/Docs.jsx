import { ArrowRight, ArrowUpRight, BookOpen, Download, HelpCircle, Repeat } from 'lucide-react'
import { Markdown, PageIntro } from '../components.jsx'
import { href, NEW_BUG_URL, REPO_URL } from '../site.js'
import installationMd from '../content/installation.md?raw'
import faqMd from '../content/faq.md?raw'
import xamppMd from '../content/migrate-from-xampp.md?raw'
import laragonMd from '../content/migrate-from-laragon.md?raw'

export const GUIDES = [
  { route: '/docs/installation/', title: 'Installation', text: 'Requirements, installing on each OS, the first run, HTTPS and building from source.', icon: Download, source: installationMd, file: 'installation.md' },
  { route: '/docs/faq/', title: 'FAQ and troubleshooting', text: 'Domains, HTTPS, PHP versions, MariaDB, Mailpit, logs and common errors.', icon: HelpCircle, source: faqMd, file: 'faq.md' },
  { route: '/docs/migrate-from-xampp/', title: 'Move from XAMPP', text: 'Bring your projects and databases across, keeping XAMPP until you are ready.', icon: Repeat, source: xamppMd, file: 'migrate-from-xampp.md' },
  { route: '/docs/migrate-from-laragon/', title: 'Move from Laragon', text: 'Keep your .test domains and move sites, databases and PHP choices.', icon: Repeat, source: laragonMd, file: 'migrate-from-laragon.md' },
]

export function DocsIndexPage() {
  return (
    <>
      <PageIntro eyebrow="Guides" title="Get set up, move over, find answers.">
        <p>Short, practical guides for installing lampRabit, moving from another stack and fixing common problems.</p>
      </PageIntro>
      <section className="section section-tight">
        <div className="container guide-grid">
          {GUIDES.map(({ route, title, text, icon: Icon }) => (
            <a className="guide-card" href={href(route)} key={route}>
              <span className="feature-icon"><Icon size={20} /></span>
              <h2>{title}</h2>
              <p>{text}</p>
              <span className="text-link">Read the guide <ArrowRight size={16} /></span>
            </a>
          ))}
          <a className="guide-card" href={href('/features/all/')}>
            <span className="feature-icon"><BookOpen size={20} /></span>
            <h2>Complete feature list</h2>
            <p>Every feature with its platform notes, and what's coming next.</p>
            <span className="text-link">Browse features <ArrowRight size={16} /></span>
          </a>
        </div>
      </section>
    </>
  )
}

/** Headings in the guide, for the "On this page" list. */
function outline(md) {
  return [...md.matchAll(/^## (.+)$/gm)].map((m) => ({
    title: m[1].replace(/[`*]/g, ''),
    id: m[1].replace(/[`*]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }))
}

export function DocPage({ route }) {
  const guide = GUIDES.find((g) => g.route === route)
  // The guide's own H1 is shown as the page title.
  const body = guide.source.replace(/^# .+\n/, '')
  const sections = outline(body)
  return (
    <div className="container doc-layout">
      <aside className="doc-nav" aria-label="Guides">
        <p className="eyebrow">Guides</p>
        <ul>
          {GUIDES.map((g) => (
            <li key={g.route}><a href={href(g.route)} aria-current={g.route === route ? 'page' : undefined}>{g.title}</a></li>
          ))}
          <li><a href={href('/features/all/')}>All features</a></li>
        </ul>
      </aside>
      <article className="doc-article">
        <p className="eyebrow"><a href={href('/docs/')}>Guides</a></p>
        <h1>{guide.title}</h1>
        <Markdown source={body} />
        <div className="doc-footer">
          <a href={`${REPO_URL}/blob/main/docs/website/${guide.file}`}>Edit this guide on GitHub <ArrowUpRight size={15} /></a>
          <a href={NEW_BUG_URL}>Something not working? Report it <ArrowUpRight size={15} /></a>
        </div>
      </article>
      {sections.length > 2 && (
        <aside className="doc-toc" aria-label="On this page">
          <p className="eyebrow">On this page</p>
          <ul>{sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ul>
        </aside>
      )}
    </div>
  )
}
