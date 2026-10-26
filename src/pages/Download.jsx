import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowDownToLine, ArrowRight, ArrowUpRight, Info } from 'lucide-react'
import { OS_INFO, PageIntro } from '../components.jsx'
import { detectOS, formatDate, formatSize, installers, useLatestRelease } from '../github.js'
import { href, LATEST_URL, REPO_URL } from '../site.js'

const FIRST_RUN = {
  windows: <>Windows may say <b>“Windows protected your PC”</b> because the installer isn't code-signed yet. Click <b>More info</b>, then <b>Run anyway</b>.</>,
  mac: <>macOS will say the app can't be opened because it isn't signed yet. Open <b>System Settings → Privacy &amp; Security</b>, scroll down and click <b>Open Anyway</b>.</>,
  linux: <>For the AppImage, make it executable first: <code>chmod +x lampRabit_*.AppImage</code>. For the .deb: <code>sudo apt install ./lampRabit_*.deb</code>.</>,
}

const PREVIEW_NOTE = 'Preview: the app runs, but Apache, Nginx and PHP can’t be downloaded on this platform yet, so you can’t serve PHP sites with it today. Mailpit, the Redis-compatible cache, tunnels and Node.js work.'

function PlatformCard({ id, files, highlight }) {
  const os = OS_INFO[id]
  return (
    <article className={`platform-card ${highlight ? 'is-highlighted' : ''}`}>
      <header>
        <span className="platform-icon">{os.icon}</span>
        <div>
          <h2>{os.name} <span className={`tag ${os.status === 'Ready' ? 'tag-green' : 'tag-amber'}`}>{os.status}</span></h2>
          <p>{os.requirement}</p>
        </div>
      </header>
      <ul className="file-list">
        {files.map(({ label, note, asset }, i) => (
          <li key={label}>
            {asset ? (
              <a className={`file-link ${i === 0 ? 'is-primary' : ''}`} href={asset.browser_download_url}>
                <ArrowDownToLine size={18} />
                <span><b>{label}</b><small>{note} · {formatSize(asset.size)}</small></span>
              </a>
            ) : (
              <a className="file-link" href={LATEST_URL}>
                <ArrowUpRight size={18} />
                <span><b>{label}</b><small>Get it from GitHub Releases</small></span>
              </a>
            )}
          </li>
        ))}
      </ul>
      {os.status !== 'Ready' && <p className="callout callout-amber"><Info size={18} /> <span>{PREVIEW_NOTE}</span></p>}
      <p className="first-run"><AlertTriangle size={16} /> <span>{FIRST_RUN[id]}</span></p>
    </article>
  )
}

export default function DownloadPage() {
  const { data: release, failed } = useLatestRelease()
  const [os, setOS] = useState('windows')
  useEffect(() => setOS(detectOS()), [])
  const groups = installers(release)
  const order = [os, ...['windows', 'mac', 'linux'].filter((o) => o !== os)]
  return (
    <>
      <PageIntro eyebrow="Download" title="Get lampRabit.">
        <p>Free and open source. The installer sets up the app for your user account; you choose which runtimes to download from inside the app.</p>
        <p className="release-line">
          {release ? <>Latest version <b>{release.tag_name}</b>, released {formatDate(release.published_at)} · <a href={href('/changelog/')}>What's new</a></>
            : failed ? <>Couldn't reach GitHub just now. <a href={LATEST_URL}>Get the latest release on GitHub</a>.</>
            : 'Checking the latest version…'}
        </p>
      </PageIntro>
      <section className="section section-tight">
        <div className="container platform-grid">
          {order.map((id, i) => <PlatformCard key={id} id={id} files={groups[id]} highlight={i === 0} />)}
        </div>
      </section>
      <section className="section section-muted">
        <div className="container two-col">
          <div>
            <h2>After installing</h2>
            <ol className="plain-steps">
              <li>Open <b>Services</b> and install Apache (or Nginx), PHP and MariaDB.</li>
              <li>Click <b>Start all</b>. On Windows, lampRabit offers to install the Microsoft Visual C++ runtime if it's missing.</li>
              <li>Put a project in <code>www</code> or click <b>New project</b>, then open <code>https://name.test</code>.</li>
            </ol>
            <a className="text-link" href={href('/docs/installation/')}>Full installation guide <ArrowRight size={16} /></a>
          </div>
          <div>
            <h2>Build from source</h2>
            <p>You need Node.js 22+, Rust and the Tauri prerequisites for your OS.</p>
            <pre className="code-block">{`git clone ${REPO_URL}.git
cd LampRabit
npm install
npm run tauri dev`}</pre>
            <a className="text-link" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>Contributing guide <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>
    </>
  )
}
