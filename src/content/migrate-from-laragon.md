# Moving from Laragon to lampRabit

Laragon and lampRabit work the same way: every folder in `www` becomes `folder.test`. Your URLs stay the same, so most projects move without changes. This guide takes about 15 minutes. Laragon isn't modified until the last, optional step.

## What changes

| | Laragon | lampRabit |
|---|---|---|
| Projects folder | `C:\laragon\www` | `C:\lampRabit\www` |
| Project URL | `http://myapp.test` | `https://myapp.test`: same domain, HTTPS on by default |
| PHP versions | One active version for all sites | Several at once; each site picks its own |
| Web server | Apache or Nginx, one at a time | Apache, Nginx, or both, chosen per site |
| HTTPS | Laragon's certificate authority | lampRabit's certificate authority (trust once) |
| Hosts file | Lines marked `#laragon magic!` | A marked `# lampRabit` section |
| Database | MySQL 8 or MariaDB (`root`, no password) | MariaDB (`root`, no password) |
| Database tools | HeidiSQL, phpMyAdmin (add-on) | phpMyAdmin and Adminer, one click |
| Email | Mailpit / Mail Catcher | Mailpit, with PHP `mail()` routed automatically |
| Run as administrator | Usually | No; asks only for the hosts file and certificate |
| Quick app (Laravel, WordPress) | Menu → Quick app | Sites → New project, with Laravel, Symfony, WordPress, blank and static presets |
| Terminal (Cmder) | Built in | Open terminal (title bar, tray, site cards) with php, composer and mariadb on PATH |
| Node.js, ngrok | Built in | Ngrok and Cloudflare tunnels on the Sites page; Node.js versions through NVM on the Services page |

## Before you start

1. Install lampRabit and its stack (Apache or Nginx, PHP, MariaDB); see the installation guide.
2. Check which PHP version your projects use in Laragon (Menu → PHP) and install the same versions in lampRabit (Services → PHP). You can install several.
3. Check whether Laragon runs **MySQL** or **MariaDB** (Menu → MySQL). This matters for Step 3.

## Step 1: Export your databases from Laragon

With Laragon's database running, export the databases you need. Either:

- **HeidiSQL** (Laragon → Database): select a database → right-click → Export database as SQL → tick "Create" for database and tables, "Insert" for data → Export.
- **Command line** (Laragon → Terminal):

  ```bat
  mysqldump -u root --routines --events --databases shop blog > C:\temp\laragon-dbs.sql
  ```

  List your own database names. Skip the system databases (`mysql`, `information_schema`, `performance_schema`, `sys`).

Note any database users other than `root` and their grants.

## Step 2: Stop Laragon

Click **Stop All** in Laragon and quit it (right-click the tray icon → Exit). If Laragon is set to start with Windows (Menu → Preferences → "Run Laragon when Windows starts"), turn that off so it doesn't take ports 80, 443 and 3306 again.

If you skip this, lampRabit will tell you which Laragon program is in the way when you start a service, and offer to stop it.

## Step 3: Import your databases

Start MariaDB in lampRabit, then either:

- **phpMyAdmin:** MariaDB card → Open phpMyAdmin → Import → choose the `.sql` file → Go.
- **Command line:** MariaDB card → ⋯ → **Open command-line client**:

  ```sql
  SOURCE C:/temp/laragon-dbs.sql;
  ```

**Coming from MySQL 8:** MariaDB reads MySQL dumps, with two common snags:
- Collation `utf8mb4_0900_ai_ci`: supported by the MariaDB versions lampRabit installs by default (11.8 LTS). If you chose an older MariaDB (10.x), replace it in the `.sql` file with `utf8mb4_unicode_ci` before importing.
- MySQL-only features (for example some JSON functions or `caching_sha2_password` users) may need adjusting. Import the tables first; recreate users in phpMyAdmin.

Recreate any extra database users you noted.

## Step 4: Move your projects

Copy (or move) each project folder from `C:\laragon\www` to `C:\lampRabit\www`. Click **Open www** in lampRabit to open the folder.

The domain stays the same: `C:\lampRabit\www\shop` is `https://shop.test`, just like Laragon's `shop.test`. Projects with a `public/` folder (Laravel, Symfony) are served from it automatically, as in Laragon.

Use real folders rather than shortcuts or junctions: lampRabit only picks up actual folders in `www`.

## Step 5: Pick PHP versions and servers

On the Sites page each site has:
- **PHP**: leave it on "Default" or choose a specific installed version for that project.
- **Server** (when Settings → Web server is "Both"): Apache or Nginx.
- **HTTPS**: on by default.

If you used Nginx in Laragon, either set Settings → Web server to **Nginx**, or to **Both** and pick Nginx for those sites. lampRabit's Nginx config routes unknown URLs to `index.php`, like Laragon's.

## Step 6: Update project configuration

- **Database:** host `127.0.0.1`, port `3306`, user `root`, empty password, as in Laragon.
- **URL:** if a project's URL was `http://shop.test`, consider switching it to `https://shop.test` (Laravel `APP_URL`, WordPress `siteurl`/`home`). Plain `http://` still works if you turn HTTPS off for the site.
- **Mail:** Laravel's default `.env` mail settings for Mailpit (`MAIL_HOST=127.0.0.1`, `MAIL_PORT=1025`) work unchanged. PHP `mail()` is routed to Mailpit automatically.
- **php.ini tweaks** you made in Laragon: put them in a `.user.ini` file in the project's served folder.
- **Custom Apache config** (Laragon's `etc\apache2\sites-enabled`): normal projects need none. For special directives, add a `.conf` file in `C:\lampRabit\etc\apache\sites\`.

## Step 7: Hosts file and HTTPS

1. On the Sites page, click **Apply changes** (or restart Apache) and approve the administrator prompt once. lampRabit writes its own section in the hosts file.
2. Laragon's entries (lines ending in `#laragon magic!`) point the same domains at `127.0.0.1`, so they don't conflict. You can remove them from `C:\Windows\System32\drivers\etc\hosts` later (edit as administrator).
3. Click **Trust certificate**. Laragon's certificate authority is different; you can remove it later with `certmgr.msc` → Trusted Root Certification Authorities (look for "Laragon").

## Step 8 (optional): Remove Laragon

Once everything works, uninstall Laragon. Keep your `.sql` export until you're sure nothing is missing.

## What's not there yet

These Laragon features are coming soon to lampRabit:

## Troubleshooting

- **"Port 80 is already in use" / "Port 3306 is already in use"**: Laragon's Apache, Nginx or MySQL is still running. Quit Laragon, or use the **Stop …** button on the service card.
- **The browser warns about the certificate**: click **Trust certificate** on the Sites page and restart the browser. Firefox needs `security.enterprise_roots.enabled` set to `true`.
- **A site shows the wrong PHP version**: set it on the site's card (Sites → PHP).
- **More help:** Settings → Troubleshooting → **Run diagnostics**.
