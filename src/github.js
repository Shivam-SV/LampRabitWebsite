import { useEffect, useState } from 'react'
import { API } from './site.js'

/** GET from the GitHub API in the browser. `data` stays null until loaded; `failed` on errors or rate limits. */
function useGitHub(path) {
  const [state, setState] = useState({ data: null, loading: true, failed: false })
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API}${path}`, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status))
        return response.json()
      })
      .then((data) => setState({ data, loading: false, failed: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, failed: true })
      })
    return () => controller.abort()
  }, [path])
  return state
}

export const useLatestRelease = () => useGitHub('/releases/latest')
export const useReleases = () => useGitHub('/releases?per_page=20')
export const useIssues = () => useGitHub('/issues?state=open&per_page=50&sort=updated')

/** Installer files in a release, grouped by platform. Update bundles and signatures are skipped. */
export function installers(release) {
  const assets = (release?.assets || []).filter((a) => !/\.(sig|json)$|\.app\.tar\.gz$/i.test(a.name))
  const find = (re) => assets.find((a) => re.test(a.name))
  return {
    windows: [
      { label: 'Installer (.exe)', note: 'Recommended', asset: find(/x64-setup\.exe$/i) },
      { label: 'MSI package', note: 'For managed installs', asset: find(/\.msi$/i) },
    ],
    mac: [
      { label: 'Apple Silicon (.dmg)', note: 'M1 and later', asset: find(/aarch64\.dmg$/i) },
      { label: 'Intel (.dmg)', note: 'Older Macs', asset: find(/x64\.dmg$/i) },
    ],
    linux: [
      { label: 'Debian / Ubuntu (.deb)', note: 'apt install ./file.deb', asset: find(/\.deb$/i) },
      { label: 'AppImage', note: 'Any distribution', asset: find(/\.appimage$/i) },
    ],
  }
}

export const formatSize = (bytes) => `${(bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0)} MB`

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })

/** The visitor's OS, for picking the main download button. Defaults to Windows. */
export function detectOS() {
  if (typeof navigator === 'undefined') return 'windows'
  const platform = (navigator.userAgentData?.platform || navigator.platform || navigator.userAgent).toLowerCase()
  if (platform.includes('mac')) return 'mac'
  if (platform.includes('linux') && !platform.includes('android')) return 'linux'
  return 'windows'
}
