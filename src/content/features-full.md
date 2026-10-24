# lampRabit features

Status labels: **Available** (in the app today) and **Coming soon** (designed and scheduled). Platform notes appear where a feature isn't on every OS.

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

### Coming soon
- **System tray**: start/stop services and open sites from the tray.
- **Start with the computer** and optionally start services automatically.
- **Open a terminal** with PHP, Composer, MariaDB and Node on the PATH.
- **Open in editor**: open a project in VS Code or another editor.
- **Visual C++ runtime check**: detect and offer to install the Microsoft runtime Apache and PHP need on Windows.
- **MariaDB data per major version**: switching MariaDB major versions keeps separate data directories (or upgrades them) instead of risking incompatibility.

---

## 2. PHP

### Multiple PHP versions side by side (Available; Windows downloads)
Install PHP 8.1, 8.2, 8.3, 8.4 and 8.5 together. Each site uses the default version or its own.

### Per-site PHP version (Available)
Pick the PHP version for a site from its card on the Sites page. lampRabit runs a pool of PHP FastCGI workers for each version in use and routes each site to the right one.

### Sensible defaults (Available)
Each PHP version gets its own `php.ini` with developer-friendly settings: errors shown, 512 MB memory limit, 128 MB uploads, OPcache on (with instant reloads), and common extensions enabled (curl, gd, intl, mbstring, mysqli, openssl, pdo_mysql, pdo_sqlite, sodium, zip and more). Per-project overrides work through a `.user.ini` file in the project.

### PHP extension manager (Coming soon)
Browse every extension for each installed PHP version, switch them on or off, and add popular extras like Xdebug, Redis, APCu, Imagick, MongoDB and PCOV with one click. Each extension shows whether it's built in, enabled, downloadable for that PHP version, or unavailable on your platform, and why. Xdebug comes preconfigured for step debugging.

### FrankenPHP (Coming soon)
Run sites on FrankenPHP, the modern PHP application server built on Caddy, as a third option next to Apache and Nginx. It brings HTTP/3 and an optional worker mode that keeps Laravel (Octane) and Symfony apps booted between requests for much faster responses. Uses lampRabit's trusted certificates and Mailpit like every other site. Available on Windows, Linux and Apple Silicon Macs.

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

### Coming soon
- **Create a project**: a guided setup for a new project: name, folder, preset, database, HTTPS.
- **Project presets**: ready-made setups for Blank PHP, Laravel, WordPress, Symfony and static sites, with the right PHP version and an optional database (and database user), Mailpit or Redis. Composer and WordPress are downloaded automatically.
- **Share a site through Ngrok or Cloudflare**: expose a project on a public URL from its card, either automatically or by entering a port.

---

## 4. Databases

### MariaDB (Available; Windows and Linux downloads)
Several MariaDB versions available, including long-term-support releases. The data directory is created on first start with a passwordless local `root` user, like XAMPP and Laragon. MariaDB shuts down gracefully so no data is lost.

### phpMyAdmin and Adminer (Available)
Install either or both from Services. They're served at `phpmyadmin.test` and `adminer.test` (and at `localhost/phpmyadmin`, `localhost/adminer`, which work without the hosts file). Local `root` logs in without a password. The MariaDB card opens phpMyAdmin directly; Overview has quick links.

### Command-line client (Available; Windows)
Open the MariaDB client in a terminal, already connected, from the MariaDB card's menu.

### Coming soon
- **Redis and Memcached**: install and run them where supported. Redis and Memcached have no official Windows builds, so on Windows lampRabit offers a Redis-compatible server (such as Garnet) or explains the limitation; on macOS and Linux it manages a package-manager install. PHP extensions are offered only where builds exist for your PHP version.

---

## 5. Email testing

### Mailpit (Available)
A local mail server that catches every email your apps send and shows it in a web inbox at `http://localhost:8025` (or `mail.test`). Nothing reaches real inboxes.

### PHP mail() routed automatically (Available)
PHP's `mail()` is pointed at Mailpit for you (Windows: php.ini SMTP settings; macOS/Linux: Mailpit's sendmail mode). Frameworks that send over SMTP (Laravel, Symfony, WordPress SMTP plugins) just need `MAIL_HOST=127.0.0.1` and `MAIL_PORT=1025`; the Settings page shows the exact values.

---

## 6. Developer tools and runtimes (Coming soon)

- **Node.js through NVM**: install NVM when you ask for it (not by default), then install and switch Node versions from lampRabit. Projects with an `.nvmrc` get the right version. Windows uses nvm-windows (which needs administrator rights or Developer Mode to switch versions; lampRabit tells you before installing); macOS and Linux use the official nvm. An existing NVM installation is detected and reused.
- **Ngrok and Cloudflare tunnels**: share `localhost` or any project on a public URL. Ngrok needs a free account (your token is stored in the system keychain); Cloudflare quick tunnels need no account.

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
Overview dashboard with live status, quick links and recent activity; light, dark and system themes; custom title bar; works at any window size.

### Platform-aware (Available)
Settings and tools only appear where they apply. For example the PHP worker count is a Windows setting, and hosts-file paths and certificate steps match your OS.

### Coming soon
- **App updates**: lampRabit checks for new versions and updates itself (signed releases).
- **Runtime update notices**: a badge when a newer patch of an installed Apache, PHP or MariaDB is available.
- **Installers**: Windows (`.exe` / `.msi`), macOS (`.dmg`), Linux (`.AppImage`, `.deb`).

---

