import { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Bug, Lightbulb, MessageSquare } from 'lucide-react'
import { Markdown, PageIntro } from '../components.jsx'
import { formatDate, formatSize, installers, useIssues, useReleases } from '../github.js'
import { ISSUES_URL, NEW_BUG_URL, NEW_IDEA_URL, RELEASES_URL } from '../site.js'

/** Release notes repeat the download table and updater-file note; the download list below covers that. */
function notesWithoutDownloads(body = '') {
  return body
    .replace(/\n## Download\n[\s\S]*?(?=\n### |\n## |$)/, '\n')
    .replace(/\nThe `\.sig`[^\n]*\n/, '\n')
}

export function ChangelogPage() {
  const { data: releases, loading, failed } = useReleases()
  const published = (releases || []).filter((r) => !r.draft)
  return (
    <>
      <PageIntro eyebrow="Changelog" title="What's new in lampRabit.">
        <p>Every release, with its notes and installers. The app tells you when a new version is out and installs it after you confirm.</p>
      </PageIntro>
      <section className="section section-tight">
        <div className="container changelog">
          {loading && <p className="muted">Loading releases from GitHub…</p>}
          {failed && <p className="callout">Couldn't load releases right now. <a href={RELEASES_URL}>See them on GitHub</a>.</p>}
          {published.map((release, i) => {
            const files = Object.values(installers(release)).flat().filter((f) => f.asset)
            return (
              <article className="release" key={release.id}>
                <aside className="release-meta">
                  <span className={`tag ${i === 0 ? 'tag-green' : ''}`}>{i === 0 ? 'Latest' : release.tag_name}</span>
                  <time dateTime={release.published_at}>{formatDate(release.published_at)}</time>
                </aside>
                <div className="release-body">
                  <h2>{release.name || release.tag_name}</h2>
                  <Markdown source={notesWithoutDownloads(release.body)} />
                  {files.length > 0 && (
                    <details className="release-files">
                      <summary>Installers ({files.length})</summary>
                      <ul>
                        {files.map(({ label, asset }) => (
                          <li key={asset.id}><a href={asset.browser_download_url}><ArrowDownToLine size={16} /> {asset.name}</a> <small>{label} · {formatSize(asset.size)}</small></li>
                        ))}
                      </ul>
                    </details>
                  )}
                  <a className="text-link" href={release.html_url}>View on GitHub <ArrowUpRight size={16} /></a>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}

const FILTERS = [
  ['all', 'All'],
  ['bug', 'Bugs'],
  ['enhancement', 'Ideas'],
]

export function IssuesPage() {
  const { data, loading, failed } = useIssues()
  const [filter, setFilter] = useState('all')
  // The issues endpoint includes pull requests; those aren't issues.
  const issues = useMemo(() => (data || []).filter((i) => !i.pull_request), [data])
  const shown = issues.filter((i) => filter === 'all' || i.labels.some((l) => l.name === filter))
  const count = (f) => (f === 'all' ? issues.length : issues.filter((i) => i.labels.some((l) => l.name === f)).length)
  return (
    <>
      <PageIntro eyebrow="Issues and ideas" title="Help make lampRabit better.">
        <p>Found a bug or missing something? Tell us on GitHub. Before opening a new one, check whether someone already reported it and add a 👍 or your details there.</p>
      </PageIntro>
      <section className="section section-tight">
        <div className="container">
          <div className="issue-actions">
            <a className="action-card" href={NEW_BUG_URL}>
              <span className="feature-icon icon-red"><Bug size={20} /></span>
              <span><b>Report a bug</b><small>Include the diagnostics report: Settings → Troubleshooting → Run diagnostics → Copy.</small></span>
              <ArrowUpRight size={18} />
            </a>
            <a className="action-card" href={NEW_IDEA_URL}>
              <span className="feature-icon icon-amber"><Lightbulb size={20} /></span>
              <span><b>Suggest a feature</b><small>Describe what you're trying to do and how you handle it today.</small></span>
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="issue-toolbar">
            <h2>Open issues</h2>
            <div className="segmented" role="tablist" aria-label="Filter issues">
              {FILTERS.map(([value, label]) => (
                <button key={value} role="tab" aria-selected={filter === value} onClick={() => setFilter(value)}>
                  {label} <span>{data ? count(value) : ''}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="muted">Loading issues from GitHub…</p>}
          {failed && <p className="callout">Couldn't load issues right now (GitHub limits how often a page can ask). <a href={ISSUES_URL}>See them on GitHub</a>.</p>}
          {data && shown.length === 0 && (
            <div className="empty-state">
              <h3>{filter === 'all' ? 'No open issues right now.' : 'Nothing here yet.'}</h3>
              <p>Be the first: <a href={NEW_BUG_URL}>report a bug</a> or <a href={NEW_IDEA_URL}>suggest a feature</a>.</p>
            </div>
          )}
          <ul className="issue-list">
            {shown.map((issue) => (
              <li key={issue.id}>
                <a href={issue.html_url}>
                  <span className={`issue-dot ${issue.labels.some((l) => l.name === 'bug') ? 'is-bug' : ''}`} aria-hidden="true" />
                  <span className="issue-main">
                    <b>{issue.title}</b>
                    <small>#{issue.number} · opened {formatDate(issue.created_at)} by {issue.user.login}</small>
                  </span>
                  <span className="issue-labels">
                    {issue.labels.map((l) => <span key={l.id} className="label" style={{ '--label': `#${l.color}` }}>{l.name}</span>)}
                  </span>
                  {issue.comments > 0 && <span className="issue-comments"><MessageSquare size={15} /> {issue.comments}</span>}
                </a>
              </li>
            ))}
          </ul>
          <a className="text-link" href={ISSUES_URL}>All issues on GitHub <ArrowUpRight size={16} /></a>
        </div>
      </section>
    </>
  )
}
