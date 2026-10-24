import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowDownToLine, ArrowRight, ArrowUpRight, Check, ChevronRight, Code2,
  Database, Download, GitBranch, Globe2, HardDriveDownload, Menu, Monitor,
  Search, Server, ShieldCheck, Sparkles, TerminalSquare, X,
} from 'lucide-react'
import featuresMd from './content/features.md?raw'
import featureListMd from './content/features-full.md?raw'
import installationMd from './content/installation.md?raw'
import faqMd from './content/faq.md?raw'
import xamppMd from './content/migrate-from-xampp.md?raw'
import laragonMd from './content/migrate-from-laragon.md?raw'

const REPO = 'Shivam-SV/LambRabit'
const REPO_URL = `https://github.com/${REPO}`
const RELEASES_URL = `${REPO_URL}/releases`
const RELEASES_API = `https://api.github.com/repos/${REPO}/releases`
const PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH || '/LampRabitWebsite/'
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://shivam-sv.github.io/LampRabitWebsite/').replace(/\/$/, '')

export const ROUTES = [
  '/', '/features/', '/features/all/', '/download/', '/docs/', '/docs/installation/', '/docs/faq/',
  '/docs/migrate-from-xampp/', '/docs/migrate-from-laragon/', '/changelog/',
]

export function getPageMeta(route) {
  const meta = {
    '/': { title: 'lampRabit — Free XAMPP Alternative for Local PHP', description: 'A free, open-source XAMPP alternative for local PHP development. Run Apache or Nginx, PHP, and MariaDB on your machine. Drop a folder into www and open it at https://yourapp.test.' },
    '/features/': { title: 'Local PHP Development Features — lampRabit', description: 'A calmer local PHP workflow: bring projects online at .test, choose project-specific runtimes, and keep your development stack in one desktop workspace.' },
    '/features/all/': { title: 'Complete lampRabit Feature List', description: 'The complete lampRabit feature list, with availability and platform notes for services, PHP, sites, databases, email testing, logs, and app tooling.' },
    '/download/': { title: 'Download lampRabit — Windows, macOS and Linux', description: 'Get lampRabit for Windows, macOS, or Linux. Installers are coming with the first public release; build from source in the meantime.' },
    '/docs/': { title: 'lampRabit Documentation — Setup, Migration and FAQ', description: 'Guides for installing lampRabit, creating local PHP sites, and moving projects from XAMPP or Laragon.' },
    '/docs/installation/': { title: 'Install lampRabit — Requirements and First Run', description: 'System requirements, installation steps, first-run setup, ports, HTTPS certificates, and how to build lampRabit from source.' },
    '/docs/faq/': { title: 'lampRabit FAQ and Troubleshooting', description: 'Answers about local PHP sites, .test domains, HTTPS, PHP versions, MariaDB, Mailpit, logs, and common service errors.' },
    '/docs/migrate-from-xampp/': { title: 'Move from XAMPP to lampRabit — Step-by-Step Guide', description: 'Move PHP projects and MariaDB databases from XAMPP to lampRabit while keeping your existing XAMPP setup intact until you are ready.' },
    '/docs/migrate-from-laragon/': { title: 'Move from Laragon to lampRabit — Step-by-Step Guide', description: 'Move local sites and databases from Laragon to lampRabit, keep your .test domains, and choose PHP versions per site.' },
    '/changelog/': { title: 'lampRabit Releases and Changelog', description: 'See lampRabit release notes, version history, and platform installer availability.' },
  }
  return meta[route] || meta['/']
}

function routeFromPath(pathname, useHash = true) {
  const hashRoute = useHash && typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  if (hashRoute) {
    const normalizedHash = hashRoute.endsWith('/') ? hashRoute : `${hashRoute}/`
    if (ROUTES.includes(normalizedHash)) return normalizedHash
  }
  const prefix = PUBLIC_PATH.replace(/\/$/, '')
  let path = pathname
  if (prefix !== '' && path.startsWith(prefix)) path = path.slice(prefix.length) || '/'
  if (!path.startsWith('/')) path = `/${path}`
  if (path === '/index.html' || path === '//') return '/'
  const normalized = path.endsWith('/') ? path : `${path}/`
  return ROUTES.includes(normalized) ? normalized : '/'
}

function sitePath(route) {
  const prefix = PUBLIC_PATH.endsWith('/') ? PUBLIC_PATH : `${PUBLIC_PATH}/`
  return `${prefix}#${route}`
}

function LampMark({ className = '' }) {
  return <svg className={className} viewBox="270 145 660 660" aria-hidden="true" focusable="false">
    <path d="M451 431 C420 389 379 328 375 263 C371 203 400 176 433 188 C482 206 512 283 519 385 L519 431 Z M749 431 L749 385 C756 283 786 206 835 188 C868 176 897 203 893 263 C889 328 848 389 817 431 Z" className="mark-shell" fill="#1b2028"/>
    <path d="M457 377 C434 340 408 294 407 254 C406 222 418 208 433 216 C463 231 483 296 490 377 Z M773 377 C780 296 800 231 830 216 C845 208 857 222 856 254 C855 294 829 340 806 377 Z" fill="#59d1a2"/>
    <path d="M376 365 L824 365 C865.974 365 900 399.026 900 441 L900 699 C900 740.974 865.974 775 824 775 L376 775 C334.026 775 300 740.974 300 699 L300 441 C300 399.026 334.026 365 376 365 Z" className="mark-shell" fill="#1b2028"/>
    <path d="M492 493 L427 558 L492 623 M708 493 L773 558 L708 623" fill="none" stroke="#59d1a2" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M580 647 L600 665 L620 647 M600 665 L600 697" fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

function Brand({ light = false }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href={sitePath('/')} aria-label="lampRabit home">
    <LampMark className={light ? "brand-mark mark-light" : "brand-mark"} />
    <span>lamp<span>Rabit</span></span>
  </a>
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  return <header className="site-header">
    <div className="header-inner"><Brand />
      <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
        <a href={sitePath('/features/')} onClick={close}>Features</a>
        <a href={sitePath('/download/')} onClick={close}>Download</a>
        <a href={sitePath('/docs/')} onClick={close}>Guides</a>
        <a href={sitePath('/changelog/')} onClick={close}>Changelog</a>
      </nav>
      <div className="header-actions"><a className="github-link" href={REPO_URL} target="_blank" rel="noreferrer"><GitBranch size={16}/> GitHub <ArrowUpRight size={13}/></a><a className="header-download" href={sitePath('/download/')}>Get lampRabit <ArrowRight size={15}/></a></div>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X/> : <Menu/>}</button>
    </div>
  </header>
}

function useReveal(route) {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.body.classList.add('motion-ready')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => { observer.disconnect(); document.body.classList.remove('motion-ready') }
  }, [route])
}

function AppPreview() {
  const [running, setRunning] = useState(true)
  const services = [
    { name: 'Apache', caption: 'Web server', port: '80', icon: <Globe2 size={17}/>, tone: 'coral' },
    { name: 'PHP', caption: 'Application runtime', port: '8.4', icon: <Code2 size={17}/>, tone: 'violet' },
    { name: 'MariaDB', caption: 'Database', port: '3306', icon: <Database size={17}/>, tone: 'amber' },
  ]
  return <div className="preview-wrap" data-reveal>
    <div className="preview-glow"/><div className="app-window">
      <div className="window-top"><div className="window-brand"><LampMark className="window-mark"/><b>lamp<span>Rabit</span></b></div><div className="window-actions"><i/><i/><i/></div></div>
      <div className="app-body">
        <div className="app-greeting"><div><span className="eyebrow">LOCAL ENVIRONMENT</span><h2>{running ? 'Your stack is ready.' : 'Services stopped.'}</h2><p>Everything you need to build locally.</p></div><div className={`running-chip ${running ? '' : 'stopped-chip'}`}><span/>{running ? 'All systems running' : 'Stopped'}</div></div>
        <div className="service-grid">{services.map((service, i) => <div className={`service-tile ${running ? 'service-running' : ''}`} style={{'--tile-index': i}} key={service.name}>
          <div className={`service-icon ${service.tone}`}>{service.icon}</div><div className="service-copy"><b>{service.name}</b><small>{service.caption}</small></div><span className={`service-ready ${running ? '' : 'ready-off'}`}><i/>{running ? 'Running' : 'Stopped'}</span><div className="service-port"><small>PORT</small><b>{service.port}</b></div>
        </div>)}</div>
        <div className="preview-bottom"><div className="mini-sites"><span className="mini-site-icon"><Globe2 size={14}/></span><span><b>my-site.test</b><small>Trusted local HTTPS</small></span><ArrowUpRight size={14}/></div><button className={`preview-start ${running ? 'is-running' : ''}`} onClick={() => setRunning((value) => !value)} aria-pressed={running}><span/>{running ? 'Stop all' : 'Start all'}</button></div>
      </div>
      <div className="preview-dock"><span className="dock-active"><Server size={14}/>Overview</span><span><Globe2 size={14}/>Sites</span><span><TerminalSquare size={14}/>Services</span><span><Database size={14}/>Logs</span></div>
    </div>
    <div className="floating-note"><span className="note-icon"><Sparkles size={15}/></span><span><b>Local-first, by design</b><small>Your code stays on your machine</small></span><ShieldCheck size={16} className="note-check"/></div>
    <div className="preview-caption">A quieter way to run your local stack <span>↗</span></div>
  </div>
}

function Hero() {
  return <section className="hero-section"><div className="hero-copy" data-reveal>
    <div className="hero-label"><span className="hero-label-dot"/> YOUR LOCAL PHP STACK</div>
    <h1>Drop a folder.<br/><em>Start building.</em></h1>
    <p className="hero-description">Apache or Nginx, PHP, and MariaDB in one desktop app. Put a project in <code>www/</code> and open it at <code>https://yourapp.test</code>.</p>
    <div className="hero-buttons"><a className="primary-button" href={sitePath('/download/')}><ArrowDownToLine size={17}/> Get lampRabit <ArrowRight size={15}/></a><a className="secondary-button" href={sitePath('/features/')}>Explore features <ArrowUpRight size={15}/></a></div>
    <div className="hero-trust"><span className="trust-open"><ShieldCheck size={14}/> Free and open source</span><span className="trust-divider"/><span>Windows · macOS · Linux</span></div>
  </div><AppPreview/><div className="hero-index"><span>01</span><span className="index-line"/><span>LOCAL DEVELOPMENT, SIMPLIFIED</span></div></section>
}

const highlightFeatures = [
  { icon: <Globe2/>, number: '01 / SITES', title: 'Every folder is a site.', text: 'Drop a project in www/ and open it at yourapp.test. No virtual-host files to write by hand.', tone: 'green' },
  { icon: <Code2/>, number: '02 / PHP', title: 'A PHP version for each project.', text: 'Keep versions side by side and choose the one each site needs.', tone: 'violet' },
  { icon: <ShieldCheck/>, number: '03 / HTTPS', title: 'Trusted HTTPS, locally.', text: 'Create local certificates for your sites and their subdomains.', tone: 'mint' },
]

function FeatureHighlights() {
  return <section className="feature-highlights section-wrap" id="highlights"><div className="section-heading" data-reveal><div><span className="eyebrow">A STACK THAT WORKS AS ONE</span><h2>Less time wiring.<br/><em>More time making.</em></h2></div><p>Keep your local PHP environment in one place, with the services, sites, and tools close at hand.</p></div>
    <div className="highlight-grid">{highlightFeatures.map((item) => <article className="highlight-card" data-reveal key={item.number}><div className={`feature-icon ${item.tone}`}>{item.icon}</div><span className="feature-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
    <div className="feature-more"><a href={sitePath('/features/')}>See all features <ArrowRight size={15}/></a></div>
  </section>
}

function StackStory() {
  return <section className="stack-story"><div className="stack-story-inner"><div className="stack-story-copy" data-reveal><span className="eyebrow">ONE WORKSPACE, YOUR WHOLE STACK</span><h2>From request<br/>to database.<br/><em>See the flow.</em></h2><p>A live service diagram shows how your web server, PHP runtime, and database connect—and helps you spot a service that stopped responding.</p><a href={sitePath('/features/')}>See service management <ArrowRight size={15}/></a></div>
    <div className="flow-visual" data-reveal><div className="flow-lines"><span/><span/><span/></div><div className="flow-node node-browser"><div className="node-icon"><Globe2 size={21}/></div><span><b>yourapp.test</b><small>Local HTTPS</small></span><i/></div><div className="flow-node node-server"><div className="node-icon"><Server size={21}/></div><span><b>Apache</b><small>Listening · :80</small></span><i/></div><div className="flow-node node-php"><div className="node-icon"><Code2 size={21}/></div><span><b>PHP 8.4</b><small>Site runtime</small></span><i/></div><div className="flow-node node-db"><div className="node-icon"><Database size={21}/></div><span><b>MariaDB</b><small>Connected · :3306</small></span><i/></div><div className="flow-caption"><span className="live-dot"/> REQUEST FLOW <span className="flow-caption-line"/> ALL SERVICES HEALTHY</div></div></div></section>
}

function MigrateCallout() {
  return <section className="migrate-callout section-wrap" data-reveal><div className="migration-mark"><ArrowRight size={20}/></div><div><span className="eyebrow">ALREADY RUNNING A LOCAL STACK?</span><h2>Bring your projects along.</h2><p>Step-by-step guides for moving from XAMPP or Laragon, with your databases and project setup in mind.</p></div><div className="migration-actions"><a href={sitePath('/docs/migrate-from-xampp/')}>From XAMPP <ChevronRight size={15}/></a><a href={sitePath('/docs/migrate-from-laragon/')}>From Laragon <ChevronRight size={15}/></a></div></section>
}

function OSAvailability() {
  const rows = [ ['Windows', 'Apache, Nginx, PHP, MariaDB, and developer tools'], ['macOS', 'App support and developer tools; runtime downloads are in progress'], ['Linux', 'App support, MariaDB downloads, and developer tools'] ]
  return <section className="availability section-wrap" data-reveal><div className="availability-copy"><span className="eyebrow">BUILT FOR YOUR MACHINE</span><h2>One app.<br/><em>Three platforms.</em></h2><p>Platform support varies by runtime. Check the install guide for exact requirements and current download availability.</p><a href={sitePath('/download/')}>See platform requirements <ArrowRight size={15}/></a></div><div className="availability-list">{rows.map(([os, detail], i) => <div className="availability-row" key={os}><span className="os-symbol">{i === 0 ? '⊞' : i === 1 ? '◒' : '◉'}</span><b>{os}</b><small>{detail}</small><Check size={16}/></div>)}</div></section>
}

function DownloadStatus() {
  const [release, setRelease] = useState(null)
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${RELEASES_API}/latest`, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('No public release'); return response.json() })
      .then((data) => setRelease(data))
      .catch(() => {})
      .finally(() => setChecked(true))
    return () => controller.abort()
  }, [])
  return { release, checked }
}

function DownloadCards({ compact = false }) {
  const { release, checked } = DownloadStatus()
  const assets = release?.assets || []
  const platforms = [
    { id: 'windows', name: 'Windows', detail: 'Windows 10 (1809+) or 11 · 64-bit', match: (name) => /\.(exe|msi)$/i.test(name) },
    { id: 'mac', name: 'macOS', detail: 'macOS 11 Big Sur or later', match: (name) => /\.dmg$/i.test(name) },
    { id: 'linux', name: 'Linux', detail: 'Ubuntu 22.04+, Debian 12+, Fedora 38+', match: (name) => /\.(appimage|deb)$/i.test(name) },
  ]
  return <div className={`download-grid ${compact ? 'download-grid-compact' : ''}`}>
    {platforms.map((platform) => {
      const asset = assets.find((item) => platform.match(item.name))
      return <article className={`download-card ${asset ? 'download-ready' : ''}`} key={platform.id}>
        <div className={`platform-icon ${platform.id}`}>{platform.id === 'windows' ? '⊞' : platform.id === 'mac' ? '◒' : '◉'}</div>
        <div className="download-card-copy"><h3>{platform.name}</h3><p>{platform.detail}</p></div>
        {asset ? <a className="download-action" href={asset.browser_download_url}><Download size={16}/> Download setup <ArrowDownToLine size={15}/></a>
          : <a className="download-action download-unavailable" href={RELEASES_URL} target="_blank" rel="noreferrer">{checked ? 'View releases' : 'Checking releases'} <ArrowUpRight size={14}/></a>}
        <span className="availability-note">{asset ? `${asset.name} · ${(asset.size / 1048576).toFixed(0)} MB` : 'App installer coming soon'}</span>
      </article>
    })}
  </div>
}


function DocumentationSpotlight() {
  return <section className="docs-spotlight section-wrap" data-reveal><div className="docs-spotlight-intro"><span className="eyebrow">DOCUMENTATION THAT GETS YOU MOVING</span><h2>Start here.<br/><em>Build with confidence.</em></h2><p>Clear setup steps, migration walkthroughs, and troubleshooting for the alpha.</p><a href={sitePath('/docs/')}>Browse all documentation <ArrowRight size={15}/></a></div><div className="docs-spotlight-grid">{guideLinks.slice(0,3).map((guide,index)=><a className="docs-spotlight-card" href={sitePath(guide.path)} key={guide.path}><span className="docs-step">0{index+1} · {guide.label}</span><span className="docs-step-icon">{guide.icon}</span><b>{guide.title}</b><small>{guide.desc}</small><ArrowUpRight className="docs-step-arrow" size={16}/></a>)}</div></section>
}

function AlphaFeedback() {
  return <section className="alpha-feedback section-wrap" data-reveal><div className="feedback-spark"><Sparkles size={22}/></div><div><span className="eyebrow">LAMP RABIT · ALPHA</span><h2>Help shape what comes next.</h2><p>Found a bug or have an idea? Tell us on GitHub. Your feedback helps guide the next release.</p></div><a className="feedback-button" href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">Share feedback <ArrowUpRight size={16}/></a></section>
}

function HomePage() {
  return <><Hero/><FeatureHighlights/><DocumentationSpotlight/><StackStory/><MigrateCallout/><Availability/><AlphaFeedback/><section className="home-download" data-reveal><div><span className="eyebrow">FREE AND OPEN SOURCE</span><h2>Your local stack,<br/><em>without the setup.</em></h2><p>Check installer availability, platform requirements, and the source build steps.</p></div><a className="primary-button" href={sitePath('/download/')}><ArrowDownToLine size={17}/> Get lampRabit <ArrowRight size={15}/></a></section></>
}

function Availability() { return <OSAvailability/> }

function PageHero({ eyebrow, title, accent, description }) {
  return <section className="page-hero" data-reveal><div><span className="eyebrow">{eyebrow}</span><h1>{title}<br/><em>{accent}</em></h1></div><p>{description}</p></section>
}

function FeatureStory({ className = '', kicker, title, accent, description, children, reverse = false, dark = false }) {
  return <section className={`feature-story section-wrap ${className} ${reverse ? 'story-reverse' : ''} ${dark ? 'story-dark' : ''}`} data-reveal><div className="feature-story-copy"><span className="eyebrow">{kicker}</span><h2>{title}<br/><em>{accent}</em></h2><p>{description}</p></div><div className="feature-story-visual">{children}</div></section>
}

function FeaturesPage() {
  return <><section className="features-hero section-wrap"><div className="features-hero-copy" data-reveal><span className="eyebrow">A LOCAL PHP WORKFLOW, REIMAGINED</span><h1>Build locally.<br/><em>Stay in flow.</em></h1><p>Less time wiring servers together. More time working on the project you opened lampRabit for.</p><div className="hero-buttons"><a className="primary-button" href={sitePath('/download/')}><ArrowDownToLine size={16}/> Try the alpha <ArrowRight size={14}/></a><a className="secondary-button" href={sitePath('/features/all/')}>Browse all features <ArrowUpRight size={14}/></a></div></div><div className="features-hero-preview" data-reveal><AppPreview/></div></section>
    <FeatureStory className="story-sites" kicker="01 — YOUR PROJECTS" title="A folder becomes" accent="a place to build." description="Drop a project into www. lampRabit gives it a local .test address, detects a public folder when present, and helps you work with trusted HTTPS."><div className="site-browser"><div className="browser-chrome"><span/><span/><span/><div><ShieldCheck size={12}/> https://shop.test</div></div><div className="site-browser-body"><div className="browser-sidebar"><b>www</b><span className="folder-active"><Globe2 size={14}/> shop</span><span><Globe2 size={14}/> portfolio</span><span><Globe2 size={14}/> api</span></div><div className="browser-main"><span className="eyebrow">LOCAL SITES</span><h3>Your projects,<br/>ready to open.</h3><div className="site-address"><span className="site-online"/>shop.test <ArrowUpRight size={13}/></div><div className="site-address"><span className="site-online"/>portfolio.test <ArrowUpRight size={13}/></div></div></div></div></FeatureStory>
    <FeatureStory className="story-versions" kicker="02 — THE RIGHT RUNTIME" title="Each project gets" accent="its own PHP." description="Keep PHP versions side by side and assign the one a project needs. Switch stacks without rebuilding your whole setup. Runtime downloads are currently available on Windows." reverse dark><div className="runtime-board"><div className="runtime-board-top"><span><Code2 size={16}/> PHP runtimes</span><span>WINDOWS</span></div><div className="runtime-version active"><span>8.4.27</span><b>ACTIVE</b><Check size={15}/></div><div className="runtime-version"><span>8.3.36</span><small>2 PROJECTS</small><ArrowRight size={14}/></div><div className="runtime-version"><span>8.2.35</span><small>AVAILABLE</small><Download size={14}/></div><div className="runtime-assignment"><span>SHOP.TEST</span><b>PHP 8.4</b><span>PORTFOLIO.TEST</span><b>PHP 8.3</b></div></div></FeatureStory>
    <FeatureStory className="story-stack" kicker="03 — YOUR WHOLE STACK" title="See what’s running." accent="Know what’s next." description="Start services individually or together. See their status, ports, and process details in one place, with health checks and clear feedback when a service needs attention."><div className="feature-service-board"><div className="service-board-header"><span>LOCAL ENVIRONMENT</span><b><i/> 3 SERVICES READY</b></div>{[['Apache','Web server',':80','coral'],['PHP','Runtime','8.4','violet'],['MariaDB','Database',':3306','amber']].map(([name,detail,port,tone],i)=><div className="service-board-row" key={name} style={{'--row-index':i}}><span className={`service-icon ${tone}`}>{i===0?<Globe2 size={17}/>:i===1?<Code2 size={17}/>:<Database size={17}/>}</span><span><b>{name}</b><small>{detail}</small></span><span className="service-board-state"><i/> Running</span><code>{port}</code></div>)}<div className="service-board-footer"><span><ShieldCheck size={14}/> Config checked before start</span><button type="button"><span/> Stop all</button></div></div></FeatureStory>
    <section className="feature-tools section-wrap" data-reveal><div><span className="eyebrow">04 — SMALL THINGS, LESS FRICTION</span><h2>Tools for the moments<br/><em>around the code.</em></h2><p>Local email testing, database helpers, readable logs, and diagnostics—close by when you need them.</p><a className="text-link" href={sitePath('/features/all/')}>See the complete feature list <ArrowRight size={15}/></a></div><div className="feature-tool-cards"><article><span className="tool-icon tool-mail"><TerminalSquare size={18}/></span><b>Catch local email</b><small>Mailpit keeps test messages out of real inboxes.</small><span className="tool-state"><i/> MAILPIT READY</span></article><article><span className="tool-icon tool-logs"><Search size={18}/></span><b>Find the useful line</b><small>Filter service logs and export a diagnostics report.</small><div className="log-lines"><i/><i/><i/></div></article><article><span className="tool-icon tool-db"><Database size={18}/></span><b>Open your database tools</b><small>Use phpMyAdmin or Adminer with MariaDB.</small><span className="tool-state"><i/> CONNECTED</span></article></div></section>
    <section className="feature-list-cta section-wrap"><span className="eyebrow">WANT THE FULL PICTURE?</span><h2>Every feature.<br/><em>Every platform note.</em></h2><p>Browse the full availability list, including current alpha limitations and planned work.</p><a className="primary-button" href={sitePath('/features/all/')}>View complete feature list <ArrowRight size={15}/></a></section>
  </>
}

function AllFeaturesPage() {
  return <><PageHero eyebrow="COMPLETE FEATURE REFERENCE" title="The full list." accent="No surprises." description="A detailed, factual inventory of what lampRabit can do today, what varies by platform, and what is planned."/><div className="feature-list-intro section-wrap"><a href={sitePath('/features/')}><ArrowRight size={14}/> Back to feature overview</a><span><i/> AVAILABLE <i className="soon-dot"/> COMING SOON</span></div><div className="content-layout feature-document full-feature-document"><MarkdownArticle source={featureListMd}/></div><div className="feature-list-bottom section-wrap"><a href={sitePath('/docs/installation/')}>Check platform requirements <ArrowRight size={14}/></a><a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">Found something missing? Share feedback <ArrowUpRight size={14}/></a></div></>
}

const guideLinks = [
  { path: '/docs/installation/', title: 'Install lampRabit', desc: 'Requirements, first run, certificates, ports, and source builds.', label: 'GETTING STARTED', icon: <Download size={18}/> },
  { path: '/docs/faq/', title: 'FAQ and troubleshooting', desc: 'Answers about sites, PHP versions, HTTPS, MariaDB, Mailpit, and logs.', label: 'HELP', icon: <Search size={18}/> },
  { path: '/docs/migrate-from-xampp/', title: 'Move from XAMPP', desc: 'Bring projects and databases across without changing your old setup first.', label: 'MIGRATION', icon: <ArrowRight size={18}/> },
  { path: '/docs/migrate-from-laragon/', title: 'Move from Laragon', desc: 'Keep your .test URLs and migrate projects, databases, and PHP choices.', label: 'MIGRATION', icon: <ArrowRight size={18}/> },
]

function DocsIndexPage() {
  const [query, setQuery] = useState('')
  const filtered = guideLinks.filter((item) => `${item.title} ${item.desc} ${item.label}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageHero eyebrow="DOCUMENTATION" title="Get set up." accent="Find an answer." description="Straightforward instructions for setting up lampRabit, moving projects, and fixing common local development issues."/><section className="docs-quickstart section-wrap"><a href={sitePath(guideLinks[0].path)}><span className="quickstart-icon"><Download size={19}/></span><span><small>NEW TO LAMPRABIT?</small><b>Start with installation</b><em>Requirements, first run, HTTPS, and ports</em></span><ArrowRight size={18}/></a><a href={sitePath(guideLinks[2].path)}><span className="quickstart-icon"><ArrowRight size={19}/></span><span><small>COMING FROM XAMPP?</small><b>Follow the migration guide</b><em>Move projects and databases step by step</em></span><ArrowRight size={18}/></a></section><section className="docs-index section-wrap"><label className="docs-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides…" aria-label="Search guides"/><kbd>⌕</kbd></label><div className="guide-grid">{filtered.map((item, i) => <a className="guide-card" data-reveal key={item.path} href={sitePath(item.path)}><span className="guide-icon">{item.icon}</span><span className="guide-label">{item.label} <span>0{i + 1}</span></span><h2>{item.title}</h2><p>{item.desc}</p><span className="guide-cta">Read guide <ArrowRight size={14}/></span></a>)}</div>{filtered.length === 0 && <p className="empty-search">No guide matches “{query}”. Try “install”, “XAMPP”, or “PHP”.</p>}</section></>
}

const docs = {
  '/docs/installation/': { title: 'Installation', source: installationMd, kicker: 'GETTING STARTED' },
  '/docs/faq/': { title: 'FAQ and troubleshooting', source: faqMd, kicker: 'HELP' },
  '/docs/migrate-from-xampp/': { title: 'Move from XAMPP', source: xamppMd, kicker: 'MIGRATION GUIDE' },
  '/docs/migrate-from-laragon/': { title: 'Move from Laragon', source: laragonMd, kicker: 'MIGRATION GUIDE' },
}

function MarkdownArticle({ source }) {
  return <article className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    a: ({ href = '', children, ...props }) => <a href={href} {...props} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>,
    table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
    h1: ({ children }) => <h1>{children}</h1>, h2: ({ children }) => <h2>{children}</h2>, h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    code: ({ children, className, ...props }) => className ? <code className={className} {...props}>{children}</code> : <code {...props}>{children}</code>,
  }}>{source}</ReactMarkdown></article>
}

function DocsArticlePage({ route }) {
  const page = docs[route]
  const routeIndex = guideLinks.findIndex((item) => item.path === route)
  return <section className="docs-article-page"><div className="article-topline"><a href={sitePath('/docs/')}>Documentation</a><ChevronRight size={14}/><span>{page.title}</span></div><div className="docs-article-layout"><aside className="docs-sidebar"><span className="eyebrow">GUIDES</span>{guideLinks.map((item) => <a className={item.path === route ? 'side-active' : ''} href={sitePath(item.path)} key={item.path}>{item.title}</a>)}<div className="sidebar-help"><b>Need a hand?</b><small>Run diagnostics in lampRabit and share the report with your issue.</small><a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">Open an issue <ArrowUpRight size={12}/></a></div></aside><div className="article-main"><div className="article-kicker"><span>{page.kicker}</span><span><span className="read-dot"/> About {Math.max(3, Math.ceil(page.source.split(/\s+/).length / 220))} min read</span></div><MarkdownArticle source={page.source}/><div className="article-end"><span>Was this guide useful?</span><a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">Suggest an improvement <ArrowUpRight size={13}/></a></div><div className="article-next"><span className="eyebrow">KEEP GOING</span>{guideLinks.filter((_, i) => i !== routeIndex).slice(0, 2).map((item) => <a href={sitePath(item.path)} key={item.path}>{item.title}<ArrowRight size={14}/></a>)}</div></div></div></section>
}

function DownloadPage() {
  const { release, checked } = DownloadStatus()
  return <><PageHero eyebrow="DOWNLOAD LAMPRABIT" title="Your next project" accent="starts here." description="lampRabit is free and open source. Packaged installers are being prepared for the first public release; build from source in the meantime."/><section className="download-page section-wrap"><div className="download-release-banner"><div className="release-mark"><HardDriveDownload size={20}/></div><div><b>{release ? `${release.name || release.tag_name} is available` : checked ? 'Installers are coming soon' : 'Checking the latest release…'}</b><small>{release ? `Published ${new Date(release.published_at).toLocaleDateString()}` : 'The project is active; packaged app installers will appear here after the first public release.'}</small></div>{release && <a href={release.html_url} className="release-link" target="_blank" rel="noreferrer">Release notes <ArrowUpRight size={14}/></a>}</div><DownloadCards/><div className="source-build"><div><span className="eyebrow">EARLY ACCESS</span><h2>Build from source.</h2><p>For contributors and early testers, the app can be built locally with Node.js, Rust, and the platform-specific Tauri prerequisites.</p></div><a className="secondary-button" href={`${REPO_URL}/blob/main/docs/website/installation.md`} target="_blank" rel="noreferrer">Source build instructions <ArrowUpRight size={15}/></a></div><div className="requirements-panel"><h2>Before you install</h2><div className="requirements-grid"><div><b><Monitor size={16}/> Windows</b><p>Windows 10 (1809+) or Windows 11, 64-bit. WebView2 is built into Windows 11; the installer will add it on Windows 10.</p></div><div><b><Monitor size={16}/> macOS</b><p>macOS 11 Big Sur or later. The app uses the built-in WebKit web view.</p></div><div><b><Monitor size={16}/> Linux</b><p>Ubuntu 22.04+, Debian 12+, Fedora 38+, or similar. WebKitGTK 4.1 is required.</p></div></div><a href={sitePath('/docs/installation/')}>Read all requirements and first-run steps <ArrowRight size={14}/></a></div></section></>
}

function ChangelogPage() {
  const [releases, setReleases] = useState([])
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${RELEASES_API}?per_page=10`, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Could not fetch releases'); return response.json() })
      .then((data) => setReleases(data))
      .catch(() => {})
      .finally(() => setChecked(true))
    return () => controller.abort()
  }, [])
  return <><PageHero eyebrow="RELEASE NOTES" title="What’s new in" accent="lampRabit." description="A transparent history of app releases, installer availability, and the work that ships."/><section className="changelog section-wrap">{releases.length ? releases.map((release) => <article className="release-entry" key={release.id}><div className="release-date"><span>{new Date(release.published_at).toLocaleDateString(undefined, { month: 'short' })}</span><b>{new Date(release.published_at).getDate()}</b><small>{new Date(release.published_at).getFullYear()}</small></div><div><span className="release-tag">{release.tag_name}</span><h2>{release.name || release.tag_name}</h2><p>{release.body || 'Release notes are available on GitHub.'}</p><a href={release.html_url} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={13}/></a></div></article>) : <div className="changelog-empty"><span className="feature-icon green"><Sparkles size={20}/></span><h2>{checked ? 'The first public release is in progress.' : 'Checking GitHub Releases…'}</h2><p>Once releases are published, version notes and installer links will appear here automatically.</p><a href={RELEASES_URL} target="_blank" rel="noreferrer">Visit GitHub Releases <ArrowUpRight size={14}/></a></div>}</section></>
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><Brand light/><p>Your local PHP stack, without the setup.</p><a href={REPO_URL} target="_blank" rel="noreferrer"><GitBranch size={16}/> Open source on GitHub <ArrowUpRight size={13}/></a></div><div className="footer-links"><div><span>PRODUCT</span><a href={sitePath('/features/')}>Overview</a><a href={sitePath('/features/all/')}>All features</a><a href={sitePath('/download/')}>Download</a><a href={sitePath('/changelog/')}>Changelog</a></div><div><span>GUIDES</span><a href={sitePath('/docs/installation/')}>Installation</a><a href={sitePath('/docs/faq/')}>FAQ</a><a href={sitePath('/docs/migrate-from-xampp/')}>From XAMPP</a></div><div><span>COMMUNITY</span><a href={REPO_URL} target="_blank" rel="noreferrer">GitHub repository</a><a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">Send alpha feedback</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} lampRabit</span><span>Built for local-first PHP development.</span><a href={sitePath('/docs/')}>Documentation <ArrowUpRight size={12}/></a></div></footer>
}

export default function App({ route: routeProp }) {
  const [currentRoute, setCurrentRoute] = useState(() => typeof window === 'undefined' ? '/' : routeFromPath(window.location.pathname, false))
  useEffect(() => {
    const updateRoute = () => setCurrentRoute(routeFromPath(window.location.pathname))
    updateRoute()
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])
  const route = routeProp || currentRoute
  useReveal(route)
  const content = useMemo(() => {
    if (route === '/') return <HomePage/>
    if (route === '/features/') return <FeaturesPage/>
    if (route === '/features/all/') return <AllFeaturesPage/>
    if (route === '/download/') return <DownloadPage/>
    if (route === '/docs/') return <DocsIndexPage/>
    if (docs[route]) return <DocsArticlePage route={route}/>
    if (route === '/changelog/') return <ChangelogPage/>
    return <HomePage/>
  }, [route])
  return <><Header/><main>{content}</main><Footer/></>
}
