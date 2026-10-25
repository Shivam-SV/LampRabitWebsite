import { useEffect, useState } from 'react'
import {
  ArrowRight, Check, Cloud, FolderPlus, Globe, HeartPulse, Layers, Lock, Mail, Plug, RefreshCw,
  ScrollText, Terminal, Zap,
} from 'lucide-react'
import { Shot, OS_INFO, GitHubIcon } from '../components.jsx'
import { detectOS, installers, useLatestRelease } from '../github.js'
import { href, REPO_URL, NEW_IDEA_URL } from '../site.js'

/** "Download for <your OS>" — straight to the installer when the release is known. */
export function DownloadButton({ className = '' }) {
  const [os, setOS] = useState('windows')
  useEffect(() => setOS(detectOS()), [])
  const { data: release } = useLatestRelease()
  const first = installers(release)[os].find((i) => i.asset)
  const target = first ? first.asset.browser_download_url : href('/download/')
  return (
    <a className={`button button-primary button-lg ${className}`} href={target}>
      {OS_INFO[os].icon} Download for {OS_INFO[os].name}
      {os !== 'windows' && <span className="tag tag-on-primary">Preview</span>}
    </a>
  )
}

function Hero() {
  const { data: release } = useLatestRelease()
  return (
    <section className="hero">
      <div className="container hero-inner">
        <a className="hero-badge" href={href('/changelog/')}>
          <span className="tag">New</span> {release ? `lampRabit ${release.tag_name.replace(/^v/, '')} is out` : 'The first public release is out'} <ArrowRight size={15} />
        </a>
        <h1>Local PHP development,<br /><span>without the setup.</span></h1>
        <p className="hero-lead">
          Apache or Nginx, PHP and MariaDB in one friendly desktop app. Drop a project into <code>www</code> and open it at <code>https://project.test</code>.
        </p>
        <div className="hero-actions">
          <DownloadButton />
          <a className="button button-ghost-dark button-lg" href={href('/features/')}>See what it does</a>
        </div>
        <p className="hero-note">Free and open source · Windows · macOS and Linux in preview</p>
      </div>
      <div className="container hero-shot">
        <Shot file="overview-dark.png" alt="lampRabit's overview dashboard with Apache, Nginx, MariaDB and Mailpit running" eager />
      </div>
    </section>
  )
}

const STACK = ['Apache', 'Nginx', 'PHP 8.1 – 8.5', 'MariaDB', 'Mailpit', 'phpMyAdmin', 'Adminer', 'Redis', 'Node.js', 'Composer']

function StackStrip() {
  return (
    <section className="stack-strip" aria-label="What's included">
      <div className="container">
        <p>Everything a PHP project needs, one click away</p>
        <ul>{STACK.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
    </section>
  )
}

function Steps() {
  const steps = [
    ['Install your stack', 'Open Services and pick the Apache or Nginx, PHP and MariaDB versions you want. Downloads come straight from the official sources.'],
    ['Start everything', 'One click on Start all. Health checks confirm each service is actually answering, not just running.'],
    ['Drop in a project', <>Put a folder in <code>www</code>, or create a Laravel, Symfony or WordPress project, and open <code>https://name.test</code>.</>],
  ]
  return (
    <section className="section">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow">How it works</p>
          <h2>From download to a running site in minutes.</h2>
        </div>
        <ol className="steps">
          {steps.map(([title, text], i) => (
            <li key={i}>
              <span className="step-number">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="terminal-card" aria-label="Example">
          <div className="terminal-bar"><i /><i /><i /></div>
          <pre><span className="t-dim">$</span> mkdir C:\lampRabit\www\shop{'\n'}<span className="t-dim">→ lampRabit: new site found, apply it?</span>{'\n'}<span className="t-dim">→</span> <span className="t-green">https://shop.test</span> <span className="t-dim">is ready, with a trusted certificate</span></pre>
        </div>
      </div>
    </section>
  )
}

export const SHOWCASE = [
  {
    eyebrow: 'Sites',
    title: 'Every folder is a site.',
    text: 'Folders in www are served at name.test with sub-domains, public/ detection and a trusted HTTPS certificate. Choose the PHP version, web server and HTTPS for each site right from its card.',
    points: ['Automatic .test domains, hosts file kept in sync', 'Trusted local HTTPS, per site', 'Share any site on a public URL'],
    file: 'sites.png',
    alt: 'Sites page with a site card showing PHP version, web server and HTTPS options',
  },
  {
    eyebrow: 'PHP',
    title: 'Every PHP version you need, side by side.',
    text: 'Install PHP 8.1 to 8.5 and keep them all. Each site runs on its own version, and in the terminal php and composer follow it too.',
    points: ['One-click installs and updates', 'A PHP version per site', 'Command-line tools on your PATH'],
    file: 'php-versions.png',
    alt: 'Services page showing PHP and MariaDB versions on a timeline',
  },
  {
    eyebrow: 'Extensions',
    title: 'Xdebug and friends, without the DLL hunt.',
    text: 'Switch bundled extensions on or off and install extras like Xdebug, Redis, APCu, Imagick and PCOV for each PHP version. PHP restarts for you.',
    points: ['Matched to your PHP version automatically', 'Xdebug preconfigured for step debugging', 'Search every extension'],
    file: 'extensions.png',
    alt: 'PHP extensions dialog listing Xdebug, Redis, APCu and other extensions with install buttons',
  },
  {
    eyebrow: 'New projects',
    title: 'Laravel, Symfony or WordPress in about a minute.',
    text: 'Create a project with its database, mail settings and HTTPS already wired up. Composer is downloaded and verified the first time you need it.',
    points: ['Blank PHP, static, Laravel, Symfony, WordPress', 'Optional database, created for you', '.env and wp-config.php written for you'],
    file: 'new-project.png',
    alt: 'New project dialog with Laravel, Symfony, WordPress, Blank PHP and Static site presets',
  },
  {
    eyebrow: 'Logs',
    title: 'When something breaks, you see why.',
    text: 'Live logs from every service with filters and export, plain-language explanations when a service fails, and a diagnostics report you can paste into an issue.',
    points: ['Port conflicts name the program in the way', 'Config errors with the file and line', 'One-click diagnostics report'],
    file: 'logs.png',
    alt: 'Logs page with service filters and log lines',
  },
]

export function Showcase({ items = SHOWCASE }) {
  return (
    <section className="section section-muted">
      <div className="container showcase">
        {items.map((item, i) => (
          <article className={`showcase-row ${i % 2 ? 'is-reversed' : ''}`} key={item.title}>
            <div className="showcase-copy">
              <p className="eyebrow">{item.eyebrow}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <ul className="check-list">
                {item.points.map((p) => <li key={p}><Check size={18} /> {p}</li>)}
              </ul>
            </div>
            <Shot file={item.file} alt={item.alt} />
          </article>
        ))}
      </div>
    </section>
  )
}

export const MORE = [
  [Lock, 'Trusted HTTPS', 'A local certificate authority issues certificates for every site and sub-domain.'],
  [Layers, 'Apache and Nginx', 'Run one or both side by side and choose per site.'],
  [Mail, 'Mailpit inbox', 'Every email your apps send is caught locally, never delivered.'],
  [Cloud, 'Share a site', 'Public URLs through Cloudflare Tunnel (no account) or ngrok.'],
  [Terminal, 'Command line', 'php, composer and MariaDB tools on your PATH, per-site PHP included.'],
  [Zap, 'Redis and Memcached', 'A Redis-compatible cache with one click, Memcached where available.'],
  [HeartPulse, 'Health checks', 'Services are checked every few seconds, not just assumed running.'],
  [Plug, 'Port conflicts', 'See which program holds a port and fix it in one step.'],
  [FolderPlus, 'Node.js via NVM', 'Install and switch Node versions; sites show what .nvmrc expects.'],
  [ScrollText, 'Logs and diagnostics', 'Filter, search and export logs; copy a privacy-safe report.'],
  [Globe, 'Tray and autostart', 'Lives in your tray and can start with your computer.'],
  [RefreshCw, 'Updates itself', 'Signed updates for the app, and notices for newer runtimes.'],
]

export function FeatureGrid() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">And a lot more</p>
          <h2>The small things that save you an afternoon.</h2>
        </div>
        <div className="feature-grid">
          {MORE.map(([Icon, title, text]) => (
            <div className="feature-card" key={title}>
              <span className="feature-icon"><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <a className="text-link" href={href('/features/all/')}>See the complete feature list <ArrowRight size={16} /></a>
      </div>
    </section>
  )
}

function Comparison() {
  const rows = [
    ['Automatic project.test domains', 'Yes', 'No (manual vhosts)', 'Yes'],
    ['Trusted local HTTPS', 'Yes, per site', 'Self-signed, manual', 'Yes'],
    ['Several PHP versions, per site', 'Yes', 'No', 'Switch globally'],
    ['Apache and Nginx side by side', 'Yes', 'Apache only', 'One at a time'],
    ['One-click version downloads', 'Yes', 'Reinstall', 'Manual download'],
    ['Health checks and diagnostics', 'Yes', 'No', 'No'],
    ['Runs without administrator rights', 'Yes', 'Often needs admin', 'Usually admin'],
    ['Open source', 'Yes (MIT)', 'Yes', 'Source available'],
  ]
  return (
    <section className="section section-muted">
      <div className="container narrow">
        <div className="section-head center">
          <p className="eyebrow">Coming from XAMPP or Laragon?</p>
          <h2>Familiar idea. Fewer workarounds.</h2>
          <p>Keep what you like about a one-click stack, and drop the manual virtual hosts and global PHP switches.</p>
        </div>
        <div className="table-wrap compare">
          <table>
            <thead><tr><th scope="col"><span className="sr-only">Feature</span></th><th scope="col">lampRabit</th><th scope="col">XAMPP</th><th scope="col">Laragon</th></tr></thead>
            <tbody>{rows.map(([f, ...cells]) => <tr key={f}><th scope="row">{f}</th>{cells.map((c, i) => <td key={i} className={i === 0 ? 'is-us' : ''}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="center-actions">
          <a className="button button-secondary" href={href('/docs/migrate-from-xampp/')}>Move from XAMPP</a>
          <a className="button button-secondary" href={href('/docs/migrate-from-laragon/')}>Move from Laragon</a>
        </div>
      </div>
    </section>
  )
}

export function Platforms() {
  const rows = [
    ['Apache, Nginx and PHP', 'yes', 'soon', 'soon'],
    ['MariaDB', 'yes', 'soon', 'yes'],
    ['Mailpit, Redis-compatible cache, tunnels, Node.js', 'yes', 'yes', 'yes'],
  ]
  const cell = (v) => v === 'yes' ? <span className="status status-yes"><Check size={16} /> Available</span> : <span className="status status-soon">Coming soon</span>
  return (
    <section className="section">
      <div className="container narrow">
        <div className="section-head center">
          <p className="eyebrow">Platforms</p>
          <h2>Ready on Windows. macOS and Linux in preview.</h2>
          <p>The app runs everywhere today. Apache, Nginx and PHP downloads for macOS and Linux are the next big milestone.</p>
        </div>
        <div className="table-wrap">
          <table className="platform-table">
            <thead><tr><th scope="col"><span className="sr-only">Runtime</span></th>{Object.values(OS_INFO).map((os) => <th scope="col" key={os.name}>{os.name} <span className={`tag ${os.status === 'Ready' ? 'tag-green' : 'tag-amber'}`}>{os.status}</span></th>)}</tr></thead>
            <tbody>{rows.map(([name, ...cells]) => <tr key={name}><th scope="row">{name}</th>{cells.map((c, i) => <td key={i}>{cell(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function CommunityBand() {
  return (
    <section className="section">
      <div className="container community">
        <div>
          <p className="eyebrow">Built in the open</p>
          <h2>Help shape what comes next.</h2>
          <p>lampRabit is free and MIT-licensed. Report a bug, suggest a feature, or browse what others are asking for.</p>
        </div>
        <div className="community-actions">
          <a className="button button-secondary" href={href('/issues/')}>Browse issues and ideas</a>
          <a className="button button-secondary" href={NEW_IDEA_URL}>Suggest a feature</a>
          <a className="button button-secondary" href={REPO_URL}><GitHubIcon size={17} /> Star on GitHub</a>
        </div>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <h2>Your next project is one folder away.</h2>
        <p>Free, open source and ready for Windows today.</p>
        <div className="hero-actions center-actions">
          <DownloadButton />
          <a className="button button-ghost-dark button-lg" href={href('/docs/installation/')}>Read the install guide</a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <StackStrip />
      <Steps />
      <Showcase />
      <FeatureGrid />
      <Comparison />
      <Platforms />
      <CommunityBand />
      <FinalCTA />
    </>
  )
}
