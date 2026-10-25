import { ArrowRight } from 'lucide-react'
import { Markdown, PageIntro, Shot } from '../components.jsx'
import { href } from '../site.js'
import { CommunityBand, FeatureGrid, FinalCTA, Platforms, Showcase, SHOWCASE } from './Home.jsx'
import featuresMd from '../content/features.md?raw'

const SERVICES = {
  eyebrow: 'Services',
  title: 'Your whole stack on one screen.',
  text: 'Start, stop and restart services one by one or all together. A live diagram shows how requests flow from your web server to PHP and the database, and every runtime shows the versions you have and the ones you can add.',
  points: ['Status, ports, process IDs and uptime', 'Install, switch and remove versions', 'Services never outlive the app'],
  file: 'services.png',
  alt: 'Services page with the stack diagram and Apache and Nginx versions',
}

const SETTINGS = {
  eyebrow: 'Settings',
  title: 'Sensible defaults, everything adjustable.',
  text: 'Ports, domain suffix, HTTPS by default, the web server mode, start with your computer, PATH tools, light and dark themes and how much motion you like. Options only show up on platforms where they work.',
  points: ['Live status under every port', 'Light, dark or follow the system', 'Reduced motion option'],
  file: 'settings.png',
  alt: 'Settings page with general options, web server mode and ports',
}

export function FeaturesPage() {
  return (
    <>
      <PageIntro eyebrow="Features" title="Everything you need to build PHP locally.">
        <p>One app for your web servers, PHP versions, databases and the tools around them, with the details handled for you.</p>
      </PageIntro>
      <div className="container intro-shot">
        <Shot file="overview.png" alt="lampRabit overview dashboard in the light theme" eager />
      </div>
      <Showcase items={[SHOWCASE[0], SERVICES, ...SHOWCASE.slice(1), SETTINGS]} />
      <FeatureGrid />
      <Platforms />
      <CommunityBand />
      <FinalCTA />
    </>
  )
}

/** The guide's feature list, minus notes meant for whoever builds this site. */
function publicFeatures(md) {
  return md
    .replace(/## Highlights \(for the homepage\)[\s\S]*?(?=\n## )/, '')
    .replace(/\(for a table on the Features page\)/, '')
    .replace(/\nKeep the comparison factual[^\n]*\n?/, '\n')
    .replace(/^# lampRabit features\n/, '')
}

export function AllFeaturesPage() {
  return (
    <>
      <PageIntro eyebrow="Features" title="The complete feature list.">
        <p>Everything lampRabit does today, with platform notes, and what's coming next.</p>
        <p><a className="text-link" href={href('/features/')}>Back to the feature tour <ArrowRight size={16} /></a></p>
      </PageIntro>
      <div className="container doc-container">
        <Markdown source={publicFeatures(featuresMd)} className="prose-features" />
      </div>
    </>
  )
}
