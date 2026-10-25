// Pulls the guides from the desktop app's repository (docs/website on main) so the site
// never drifts from the app. If GitHub can't be reached, the copies in src/content stay.
import fs from 'node:fs/promises'
import path from 'node:path'

const RAW = 'https://raw.githubusercontent.com/Shivam-SV/LambRabit/main/docs/website'
const FILES = ['features.md', 'installation.md', 'faq.md', 'migrate-from-xampp.md', 'migrate-from-laragon.md']
const outDir = path.join(process.cwd(), 'src', 'content')

let updated = 0
for (const file of FILES) {
  try {
    const response = await fetch(`${RAW}/${file}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    await fs.writeFile(path.join(outDir, file), await response.text())
    updated++
  } catch (error) {
    console.warn(`sync-content: kept the existing ${file} (${error.message})`)
  }
}
console.log(`sync-content: ${updated}/${FILES.length} guides updated from the app repository.`)
