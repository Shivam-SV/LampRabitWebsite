# lampRabit features

Status labels: **Available** (in the app today) and **Coming soon** (designed and scheduled). Platform notes appear where a feature isn't on every OS.

---

## Highlights (for the homepage)

- **Every folder is a site.** Put a project in `www/` and open `https://project.test`. No virtual-host files, no hosts-file editing.
- **Real HTTPS, locally.** lampRabit creates its own certificate authority and trusted certificates for every site, sub-domains included.
- **Any PHP version, per project.** Run PHP 8.1 to 8.5 side by side; each site picks its own.
- **Apache, Nginx, or both.** Choose per site.
- **Command line included.** `php`, `composer` and the MariaDB tools on your PATH, following each site's PHP version.
- **Batteries included.** phpMyAdmin, Adminer and Mailpit, installed with one click.
- **Tells you what's wrong.** Health checks, port-conflict detection that names the program in the way, and a diagnostics report.

---

## 1. Services

### Service management (Available)
Start, stop and restart Apache, Nginx, MariaDB and Mailpit individually or all at once. Each service card shows its status, version, port, process ID and uptime. Services never outlive the app: closing or crashing lampRabit stops them, so nothing is left holding a port.

### One-click runtimes and versions (Available; platform-limited)
Install, switch and remove versions of Apache, Nginx, PHP and MariaDB from the Services page. Downloads come straight from the official sources (Apache Lounge, nginx.org, windows.php.net, mariadb.org) and are checked against their published SHA-256 checksums before use (nginx.org publishes PGP signatures only; those downloads rely on HTTPS). Switching a version restarts the services that use it.

Platform note: Windows has downloads for everything. On Linux, MariaDB downloads are available; Apache, Nginx and PHP downloads for macOS and Linux are coming soon.

### Your stack at a glance (Available)
A live diagram of web server → PHP → MariaDB, animated while requests can flow, with each runtime's versions on a timeline: active, installed and available at a glance.

### Health checks (Available)
lampRabit checks running services every few seconds: Apache and Nginx must answer HTTP, MariaDB must accept connections, Mailpit's health endpoint must respond. A service that is running but not answering is flagged "Not responding" instead of looking fine. Web server configurations are tested before every start, so a broken config file is caught with the file and line number.

### Problems explained (Available)
When a service fails to start or stops unexpectedly, its card explains why in plain language and suggests a fix: port already in use, missing Microsoft Visual C++ runtime, invalid configuration line, MariaDB data from a different version, and more.

### Port conflict detection (Available)
If a port is taken, lampRabit names the program holding it (for example `node.exe, PID 6096`), explains common culprits (IIS / Windows HTTP Server, Skype, another XAMPP or Laragon, Docker), and offers to change the port or stop that program. Settings shows live status under every port field.

### Apache and Nginx (Available; Nginx on Windows)
Run Apache, Nginx, or both. With both, Apache keeps ports 80/443 and Nginx gets its own (8080/8443 by default), and you choose the server for each site. Overlapping ports are rejected before anything starts. Nginx sites get front-controller routing out of the box, so Laravel, Symfony and WordPress pretty URLs just work.

Platform note: Nginx downloads are Windows-only for now (nginx.org publishes Windows builds only); macOS and Linux support is coming soon.

### System tray (Available)
lampRabit lives in the system tray: start or stop everything, open the www folder or a terminal, and quit from its menu. Closing the window keeps your services running (you can turn this off).

### Start with your computer (Available)
Start lampRabit when you sign in (it opens quietly in the tray), and optionally start all services as soon as it opens.

### Open a terminal (Available)
A terminal with PHP, Composer and the MariaDB client on the PATH, from the title bar, the tray or any site card (opens in the project folder).

### PHP, Composer and MariaDB on your PATH (Available)
One switch in Settings puts `php`, `composer`, `mysql`, `mariadb`, `mysqldump` and friends on your PATH, so they work in any terminal, IDE or script. They always run the versions you've made active, with lampRabit's php.ini and database port, and inside a site that has its own PHP version, `php` and `composer` use that version automatically. No admin rights needed; on macOS and Linux it's a marked block in your shell profile that's removed cleanly when you switch it off.

### Open in editor (Available)
Open any project in VS Code, Cursor, PhpStorm, Sublime Text, Zed or another editor command of your choice.

### Visual C++ runtime check (Available, Windows)
Apache and PHP on Windows need Microsoft's Visual C++ runtime. lampRabit checks for it and, if it's missing, installs it with one click (one administrator prompt).

### Safe MariaDB upgrades (Available)
lampRabit remembers which MariaDB version last used your databases. Moving to a newer release upgrades the system tables automatically; moving back to an older one is blocked with an explanation, because it can damage data.

---

## 2. PHP

### Multiple PHP versions side by side (Available; Windows downloads)
Install PHP 8.1, 8.2, 8.3, 8.4 and 8.5 together. Each site uses the default version or its own.

### Per-site PHP version (Available)
Pick the PHP version for a site from its card on the Sites page. lampRabit runs a pool of PHP FastCGI workers for each version in use and routes each site to the right one. In a terminal, `php` and `composer` inside that site's folder use the same version.

### Sensible defaults (Available)
Each PHP version gets its own `php.ini` with developer-friendly settings: errors shown, 512 MB memory limit, 128 MB uploads, OPcache on (with instant reloads), and common extensions enabled (curl, gd, intl, mbstring, mysqli, openssl, pdo_mysql, pdo_sqlite, sodium, zip and more). Per-project overrides work through a `.user.ini` file in the project.

### PHP extension manager (Available, Windows)
Browse every extension for each installed PHP version, switch them on or off, and add popular extras with one click: Xdebug, Redis (phpredis), APCu, igbinary, MongoDB, PCOV, Imagick and YAML. Each extra shows the version available for that exact PHP release, or "no build for PHP 8.x yet". Xdebug comes preconfigured for step debugging (trigger mode, port 9003), and PHP restarts automatically when you change something. On macOS and Linux this arrives with lampRabit's PHP downloads for those platforms.

### Worker pools (Available)
On Windows each PHP version runs as several worker processes (4 by default, adjustable) so pages load in parallel. Crashed workers restart automatically; a worker that keeps crashing is stopped and reported instead of looping.

---

## 3. Sites

### Automatic sites (Available)
Every folder in `www/` becomes a site at `<folder>.test` (the suffix is configurable, for example `.localhost`). Sub-domains work too: `api.shop.test` is served by `shop`. If a project has a `public/` folder (Laravel, Symfony), that's what gets served.

### Local HTTPS with a trusted certificate (Available)
lampRabit creates a local certificate authority once; trust it with one click (Windows asks you to confirm; on macOS it uses your login keychain). Every site then gets a certificate for its domain and sub-domains, renewed automatically. HTTPS is on by default for new sites and can be turned off per site or globally.

### Hosts file managed for you (Available)
When Apache starts, lampRabit adds your sites to the system hosts file, with one administrator prompt only when the list changed. Only lampRabit's own marked section is touched; everything else is kept byte for byte, read-only hosts files are handled, and a backup of the previous file is kept. With the `.localhost` suffix no hosts file is needed at all.

### Apply changes (Available)
Add a folder while the server is running and lampRabit offers to apply it: domains, certificates and the hosts file update together.

### Create a project (Available)
A guided "New project" dialog: name the project (with a live preview of its URL), pick a preset, choose the PHP version, web server and HTTPS, and optionally create a database. Progress and tool output stream live; if anything fails, nothing is left behind and you can try again.

### Project presets (Available)
- **Blank PHP** and **Static site**: ready instantly.
- **Laravel**: the latest Laravel via Composer, with `.env` already pointing at the new MariaDB database and Mailpit, and migrations run.
- **Symfony**: the Symfony skeleton with `DATABASE_URL` and `MAILER_DSN` set.
- **WordPress**: the latest release (checksum-verified) with `wp-config.php` written, including fresh security keys; finish the install in the browser.

Composer is downloaded and verified the first time it's needed.

### Coming soon
- **More presets**: dedicated database users and Redis for presets that use them.
### Share a site on the internet (Available)
Put any site on a public URL from its card, for testing webhooks, showing a client or trying a phone. Requests reach the site with its own domain, so virtual hosts keep working. Share any other local port too (for example a Node dev server). Choose Cloudflare quick tunnels (no account, random trycloudflare.com address) or Ngrok (free account; your authtoken is kept in the system keychain, never in a file). Apps that store their own URL (WordPress, Laravel's `APP_URL`) may still redirect to the `.test` domain.

---

## 4. Databases

### MariaDB (Available; Windows and Linux downloads)
Several MariaDB versions available, including long-term-support releases. The data directory is created on first start with a passwordless local `root` user, like XAMPP and Laragon. MariaDB shuts down gracefully so no data is lost.

### phpMyAdmin and Adminer (Available)
Install either or both from Services. They're served at `phpmyadmin.test` and `adminer.test` (and at `localhost/phpmyadmin`, `localhost/adminer`, which work without the hosts file). Local `root` logs in without a password. The MariaDB card opens phpMyAdmin directly; Overview has quick links.

### Command-line client (Available; Windows)
Open the MariaDB client in a terminal, already connected, from the MariaDB card's menu.

### Redis (Available)
A Redis-compatible server on every platform: Microsoft's Garnet, installed from Services together with a private .NET runtime (nothing is installed system-wide). It runs on port 6379 with health checks and logs like every other service. Data is kept in memory, which suits caches, sessions and queues in development. PHP apps can use it through Predis or the phpredis extension (one click in the PHP extension manager).

### Memcached (Available on macOS and Linux)
lampRabit runs the `memcached` installed on your system (`brew install memcached` or `apt install memcached`). There are no maintained Memcached builds for Windows, so on Windows lampRabit explains this and suggests Redis instead.

---

## 5. Email testing

### Mailpit (Available)
A local mail server that catches every email your apps send and shows it in a web inbox at `http://localhost:8025` (or `mail.test`). Nothing reaches real inboxes.

### PHP mail() routed automatically (Available)
PHP's `mail()` is pointed at Mailpit for you (Windows: php.ini SMTP settings; macOS/Linux: Mailpit's sendmail mode). Frameworks that send over SMTP (Laravel, Symfony, WordPress SMTP plugins) just need `MAIL_HOST=127.0.0.1` and `MAIL_PORT=1025`; the Settings page shows the exact values.

---

## 6. Developer tools and runtimes

### Node.js through NVM (Available)
lampRabit manages Node.js versions through NVM. If you already use NVM it's detected and reused; otherwise it's installed only when you ask (Windows: the official nvm-windows installer, with one administrator prompt; macOS and Linux: the official nvm script). Install, switch the default and remove Node versions from Services, with LTS releases labelled. Sites show the Node version their `.nvmrc` asks for, and warn if it isn't installed. On Windows, switching versions needs administrator approval unless Developer Mode is on; lampRabit tells you which applies.

---

## 7. Logs and troubleshooting

### Live logs (Available)
One place for every log: Apache and Nginx error and access logs, PHP errors, MariaDB, Mailpit and lampRabit's own activity. Each line shows its time, service and severity. History is read from disk, so you see earlier runs too.

### Filter, search and export (Available)
Filter by service, severity (error, warning, notice, info, access, debug) and time range; search text; pause the live view; export what you see to a file; clear all log files.

### System activity log (Available)
Everything lampRabit does is recorded: services starting, stopping, restarting or crashing, versions installed or switched, settings saved, sites applied, hosts file updates, certificate trust. Saved to `logs/lampRabit.log`.

### Diagnostics report (Available)
One click produces a report with versions, Microsoft runtime presence, service health, who is using each port, web server config tests, PHP workers, hosts and certificate status, and recent errors. Copy it into a bug report or save it, with your user name and home folder hidden.

---

## 8. App

### Modern interface (Available)
Overview dashboard with live status, quick links and recent activity; light, dark and system themes; custom title bar; works at any window size. Subtle motion makes it feel responsive: pages and dialogs ease in, buttons give under the cursor, and the rabbit in the title bar twitches its ears, looks around and wiggles its nose every few minutes.

### Motion you control (Available)
Settings → Appearance → Motion: follow the system's reduce-motion preference (default), full motion, reduced (gentle fades only; nothing slides, bounces or plays by itself), or off.

### Platform-aware (Available)
Settings and tools only appear where they apply. For example the PHP worker count is a Windows setting, and hosts-file paths and certificate steps match your OS.

### App updates (Available)
lampRabit checks GitHub for a new version when it starts (you can turn this off), shows it in the title bar, and installs it in place after you confirm. Updates are cryptographically signed; your environment, sites and databases are untouched.

### Runtime update notices (Available)
When a newer patch of an installed Apache, Nginx, PHP, MariaDB, Mailpit, Adminer, phpMyAdmin or Redis is available (for example PHP 8.4.27 → 8.4.30), Services shows a badge and a one-click install. New versions are installed alongside the old one; you switch when you're ready.

### Installers (Available)
Windows (`.exe` / `.msi`), macOS for Apple Silicon and Intel (`.dmg`), and Linux (`.AppImage`, `.deb`) from GitHub Releases. Builds aren't code-signed yet, so Windows and macOS show a warning on first launch; the installation guide explains the one-time step.

### Coming soon
- **Code-signed installers** for Windows and macOS.
- **Apache, Nginx and PHP downloads on macOS and Linux**, making those platforms fully supported.

---

## Comparison (for a table on the Features page)

| | lampRabit | XAMPP | Laragon |
|---|---|---|---|
| Automatic `project.test` domains | Yes | No (manual vhosts) | Yes |
| Trusted local HTTPS | Yes, per site | Self-signed, manual | Yes |
| Several PHP versions at once, per site | Yes | No | Switch globally |
| Apache and Nginx side by side | Yes | Apache only | One at a time |
| One-click version downloads | Yes | Reinstall | Manual download |
| Port conflict explanation | Names the program and suggests fixes | Error message | Error message |
| Health checks and diagnostics report | Yes | No | No |
| Mail catcher | Mailpit | Mercury | Mailpit option |
| Runs without administrator rights | Yes (asks only for hosts and certificates) | Often needs admin | Usually run as admin |
| macOS and Linux | Preview (Apache, Nginx and PHP downloads coming) | Yes | Windows only |
| Open source | Yes | Yes | Source available |

Keep the comparison factual and update it if competitors change; avoid disparaging language.
