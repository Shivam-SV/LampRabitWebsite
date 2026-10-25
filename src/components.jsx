import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowUpRight, Laptop, Menu, TerminalSquare, X } from 'lucide-react'
import { REPO_URL, ISSUES_URL, NEW_BUG_URL, NEW_IDEA_URL, RELEASES_URL, href, asset } from './site.js'

export function Logo({ className = '' }) {
  return (
    <svg className={className} viewBox="270 145 660 660" aria-hidden="true" focusable="false">
      <path className="logo-head" d="M451 431 C420 389 379 328 375 263 C371 203 400 176 433 188 C482 206 512 283 519 385 L519 431 Z M749 431 L749 385 C756 283 786 206 835 188 C868 176 897 203 893 263 C889 328 848 389 817 431 Z M376 365 L824 365 C865.974 365 900 399.026 900 441 L900 699 C900 740.974 865.974 775 824 775 L376 775 C334.026 775 300 740.974 300 699 L300 441 C300 399.026 334.026 365 376 365 Z" />
      <path fill="#59d1a2" d="M457 377 C434 340 408 294 407 254 C406 222 418 208 433 216 C463 231 483 296 490 377 Z M773 377 C780 296 800 231 830 216 C845 208 857 222 856 254 C855 294 829 340 806 377 Z" />
      <path d="M492 493 L427 558 L492 623 M708 493 L773 558 L708 623" fill="none" stroke="#59d1a2" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M580 647 L600 665 L620 647 M600 665 L600 697" fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Brand() {
  return (
    <a className="brand" href={href('/')} aria-label="lampRabit home">
      <Logo className="brand-logo" />
      <span>lamp<b>Rabit</b></span>
    </a>
  )
}

const NAV = [
  ['/features/', 'Features'],
  ['/docs/', 'Guides'],
  ['/changelog/', 'Changelog'],
  ['/issues/', 'Issues'],
]

export function GitHubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export function Header({ route }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const active = (path) => (path === '/docs/' ? route.startsWith('/docs/') : route.startsWith(path))
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Brand />
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main">
          {NAV.map(([path, label]) => (
            <a key={path} href={href(path)} aria-current={active(path) ? 'page' : undefined}>{label}</a>
          ))}
          <a className="nav-github-mobile" href={REPO_URL}>GitHub</a>
        </nav>
        <div className="header-actions">
          <a className="icon-link" href={REPO_URL} aria-label="lampRabit on GitHub"><GitHubIcon /></a>
          <a className="button button-primary button-sm" href={href('/download/')}>Download</a>
          <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  const columns = [
    ['Product', [['Features', href('/features/')], ['All features', href('/features/all/')], ['Download', href('/download/')], ['Changelog', href('/changelog/')]]],
    ['Guides', [['Installation', href('/docs/installation/')], ['FAQ', href('/docs/faq/')], ['Move from XAMPP', href('/docs/migrate-from-xampp/')], ['Move from Laragon', href('/docs/migrate-from-laragon/')]]],
    ['Community', [['Issues and ideas', href('/issues/')], ['Report a bug', NEW_BUG_URL], ['Suggest a feature', NEW_IDEA_URL], ['Contribute', `${REPO_URL}/blob/main/CONTRIBUTING.md`]]],
    ['Project', [['GitHub', REPO_URL], ['Releases', RELEASES_URL], ['Security', `${REPO_URL}/security/policy`], ['MIT License', `${REPO_URL}/blob/main/LICENSE`]]],
  ]
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Brand />
          <p>Local PHP development, without the setup. Free and open source.</p>
          <a className="footer-github" href={REPO_URL}><GitHubIcon size={16} /> Star on GitHub</a>
        </div>
        {columns.map(([title, links]) => (
          <div className="footer-col" key={title}>
            <h2>{title}</h2>
            <ul>
              {links.map(([label, url]) => (
                <li key={label}><a href={url}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} lampRabit contributors · MIT License</span>
        <a href={ISSUES_URL}>Found a problem with this site? Tell us <ArrowUpRight size={14} /></a>
      </div>
    </footer>
  )
}

/** A screenshot in a soft window frame. */
export function Shot({ file, alt, className = '', eager = false }) {
  return (
    <figure className={`shot ${className}`}>
      <img src={asset(`screenshots/${file}`)} alt={alt} width="1280" height="860" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  )
}

export function WindowsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 5.1 10.4 4v7.2H3zM11.4 3.9 21 2.5v8.7h-9.6zM3 12.2h7.4v7.2L3 18.3zM11.4 12.2H21v8.8l-9.6-1.4z" />
    </svg>
  )
}

export const OS_INFO = {
  windows: { name: 'Windows', icon: <WindowsIcon />, requirement: 'Windows 10 (1809+) or 11, 64-bit', status: 'Ready' },
  mac: { name: 'macOS', icon: <Laptop size={20} />, requirement: 'macOS 11 Big Sur or later', status: 'Preview' },
  linux: { name: 'Linux', icon: <TerminalSquare size={20} />, requirement: 'Ubuntu 22.04+, Debian 12+, Fedora 38+', status: 'Preview' },
}

const DOC_LINKS = {
  'installation.md': '/docs/installation/',
  'faq.md': '/docs/faq/',
  'features.md': '/features/all/',
  'migrate-from-xampp.md': '/docs/migrate-from-xampp/',
  'migrate-from-laragon.md': '/docs/migrate-from-laragon/',
}

const slug = (children) =>
  String(Array.isArray(children) ? children.join('') : children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Renders guide or release-note markdown with the site's typography. */
export function Markdown({ source, className = '' }) {
  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href: url = '', children }) => {
            const doc = DOC_LINKS[url.split('#')[0].split('/').pop()]
            if (doc) return <a href={href(doc)}>{children}</a>
            const external = /^https?:/.test(url)
            return <a href={url} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>
          },
          h2: ({ children }) => <h2 id={slug(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={slug(children)}>{children}</h3>,
          table: ({ children }) => <div className="table-wrap"><table>{children}</table></div>,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}

export function PageIntro({ eyebrow, title, children }) {
  return (
    <section className="page-intro">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children && <div className="lead">{children}</div>}
      </div>
    </section>
  )
}
