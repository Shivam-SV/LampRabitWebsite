# Moving from XAMPP to lampRabit

This guide moves your projects and databases from XAMPP to lampRabit. It takes about 15 minutes for a typical setup. Your XAMPP installation isn't modified until the last, optional step, so you can go back at any time.

## What changes

| | XAMPP | lampRabit |
|---|---|---|
| Projects folder | `C:\xampp\htdocs` | `C:\lampRabit\www` |
| Project URL | `http://localhost/myapp` | `https://myapp.test` (and `http://localhost/myapp` still works) |
| Virtual hosts | Edit `httpd-vhosts.conf` and the hosts file by hand | Automatic for every folder |
| HTTPS | Self-signed, browser warnings | Trusted local certificates |
| PHP versions | One per XAMPP install | Several side by side, chosen per site |
| Database | MariaDB (`root`, no password) | MariaDB (`root`, no password) |
| phpMyAdmin | `localhost/phpmyadmin` | `localhost/phpmyadmin` or `phpmyadmin.test` |
| Email | Mercury / sendmail setup | Mailpit catches all mail, no setup |
| php.ini | `C:\xampp\php\php.ini`, edited by hand | Generated per PHP version; per-project `.user.ini` |

## Before you start

1. Install lampRabit and its stack (Apache, PHP, MariaDB); see the installation guide. Install phpMyAdmin too if you use it.
2. Note your PHP version in XAMPP (XAMPP Control Panel → Apache → Admin → `phpinfo`), so you can install the same major version in lampRabit if a project needs it.

## Step 1: Export your databases from XAMPP

Start MySQL in the XAMPP Control Panel, then export each database you need. Either:

- **phpMyAdmin:** `http://localhost/phpmyadmin` → select the database → Export → Quick → SQL → Go. Repeat per database.
- **Command line** (faster for several databases), in a terminal:

  ```bat
  cd C:\xampp\mysql\bin
  mysqldump -u root --routines --events --databases shop blog > C:\temp\xampp-dbs.sql
  ```

  List your own database names after `--databases`. Don't export the system databases (`mysql`, `information_schema`, `performance_schema`, `phpmyadmin`, `test`); lampRabit has its own.

If your databases use users other than `root`, note their names, passwords and grants (phpMyAdmin → User accounts) so you can recreate them.

## Step 2: Stop XAMPP

In the XAMPP Control Panel, stop Apache and MySQL. If you installed them as Windows services (the "Service" checkbox is ticked), untick it so they don't start with Windows and hold ports 80, 443 and 3306.

If you skip this, lampRabit will tell you exactly which XAMPP program is in the way when you start a service, and offer to stop it.

## Step 3: Copy your projects

Copy each project folder from `C:\xampp\htdocs` to `C:\lampRabit\www`. (Click **Open www** in lampRabit to open the folder.)

Skip XAMPP's own folders: `dashboard`, `img`, `webalizer`, `xampp`, and the default `index.php`.

Each folder becomes a site: `C:\lampRabit\www\shop` is `https://shop.test`. Folder names are turned into domain names in lowercase, with spaces and symbols replaced by dashes (`My Shop` becomes `my-shop.test`).

## Step 4: Import your databases

Start MariaDB in lampRabit, then either:

- **phpMyAdmin:** open it from the MariaDB card → Import → choose the `.sql` file → Go.
- **Command line:** MariaDB card → ⋯ → **Open command-line client**, then:

  ```sql
  SOURCE C:/temp/xampp-dbs.sql;
  ```

  Use forward slashes in the path.

Recreate any extra database users you noted in Step 1 (phpMyAdmin → User accounts → Add user account).

## Step 5: Update project configuration

- **Database host:** use `127.0.0.1` (or `localhost`), port `3306`, user `root`, empty password. Same as XAMPP, so most configs need no change.
- **URLs:** if a project stores its own URL (WordPress `siteurl`/`home`, Laravel `APP_URL`, Magento base URLs), change `http://localhost/shop` to `https://shop.test`. For WordPress, the simplest way is WP-CLI or a search-replace plugin, since URLs are also stored inside content.
- **Mail:** point SMTP settings at `127.0.0.1:1025` (Mailpit). Plain PHP `mail()` already goes to Mailpit.

## Step 6: Bring over php.ini changes

lampRabit generates `php.ini` for each PHP version with developer-friendly defaults (512 MB memory, 128 MB uploads, 120 s execution time, errors displayed, OPcache on). If you changed other settings in XAMPP's `php.ini`, put them in a `.user.ini` file in the project's folder (or its `public/` folder), for example:

```ini
max_input_vars = 5000
memory_limit = 1G
```

PHP picks up `.user.ini` within a few minutes; restart Apache to apply it immediately.

## Step 7: Bring over Apache changes

- **`.htaccess` files** work as before (Apache honours them, `AllowOverride All`).
- **Custom virtual hosts** from `httpd-vhosts.conf` aren't needed for normal projects. If you had special directives, add them in a `.conf` file in `C:\lampRabit\etc\apache\sites\`; lampRabit includes every file there and never overwrites them.
- **Hosts file entries** you added by hand for XAMPP virtual hosts can be removed; lampRabit manages its own section.

## Step 8: Open your sites

On the Sites page, click **Apply changes** if shown (approve the administrator prompt once to update the hosts file), click **Trust certificate** the first time, then open your sites.

## Step 9 (optional): Remove XAMPP

Once everything works, you can uninstall XAMPP (`C:\xampp\uninstall.exe`). Keep `C:\temp\xampp-dbs.sql` until you're sure nothing is missing.

## Troubleshooting

- **"Port 80 is already in use"**: XAMPP's Apache (`httpd.exe`) is still running, possibly as a Windows service. Stop it, or use **Stop httpd.exe…** on the service card.
- **A page shows a database connection error**: check the database name and user exist in lampRabit's MariaDB (phpMyAdmin), and the host is `127.0.0.1`.
- **A project needs an older PHP**: install it on the Services page, then choose it on the site's card (Sites → PHP).
- **More help:** Settings → Troubleshooting → **Run diagnostics**.
