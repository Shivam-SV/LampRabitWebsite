# FAQ and troubleshooting

## General

**Is lampRabit free?**
Yes. It's free and open source: https://github.com/Shivam-SV/LambRabit

**What does the name mean?**
LAMP (Linux, Apache, MySQL/MariaDB, PHP), the classic web stack, plus a rabbit: it's quick.

**Does it need administrator rights?**
No. The app and all services run as your normal user. Your system asks for approval only to update the hosts file (when your site list changes) and, on Windows, to confirm trusting lampRabit's certificate.

**Which platforms are supported?**
Windows, macOS and Linux. One-click downloads cover every runtime on Windows; on macOS and Linux some runtime downloads are still coming (see the installation guide).

**Can I use it next to XAMPP or Laragon?**
Yes, but not at the same time on the same ports. Stop one before starting the other, or give lampRabit different ports in Settings → Ports.

**Where are my files?**
Everything is in one folder: `C:\lampRabit` on Windows, `~/lampRabit` on macOS and Linux. Projects are in `www`, databases in `data`, logs in `logs`.

## Sites

**How do I add a site?**
Create a folder in `www` (Open www in the title bar). It's available at `https://<folder>.test`. If the web server is running, click **Apply changes** on the Sites page.

**My site doesn't open: "This site can't be reached".**
The domain isn't in the hosts file yet. On the Sites page, click **Update hosts file** (or **Apply changes**) and approve the administrator prompt. Alternatively, set the domain suffix to `localhost` in Settings; `*.localhost` works without the hosts file.

**Updating the hosts file fails.**
lampRabit handles read-only hosts files automatically. If it still fails, the error message says why; most often security software (Windows Defender, antivirus) protects the hosts file. Allow lampRabit in that software, or add the lines shown on the Sites page to the hosts file by hand. A copy of your previous hosts file is kept in `tmp/hosts.backup`.

**The browser says the connection isn't private.**
Click **Trust certificate** on the Sites page, confirm, and restart the browser. Firefox needs `security.enterprise_roots.enabled` set to `true` in `about:config`.

**Can I turn HTTPS off?**
Yes, per site (switch on its card) or for all new sites (Settings → General → HTTPS by default).

**My Laravel/Symfony site shows a file list instead of the app.**
lampRabit serves the `public/` folder automatically when it exists. Make sure the project has one, then click **Apply changes**.

**Pretty URLs don't work.**
On Apache, check the project's `.htaccess` (Apache honours it). On Nginx, lampRabit routes unknown URLs to `index.php` automatically.

## PHP

**How do I use a different PHP version for one project?**
Install the version on the Services page, then pick it on the site's card (Sites → PHP).

**How do I change a php.ini setting?**
For one project, add a `.user.ini` file in its served folder (for example `public/.user.ini`) with the settings you need. lampRabit's generated `php.ini` is rewritten on every start, so don't edit it directly.

**Pages are slow when several requests run at once (Windows).**
Raise Settings → Web server → **PHP workers per version** (default 4).

## Databases

**What are the database credentials?**
Host `127.0.0.1`, port `3306`, user `root`, no password.

**How do I open phpMyAdmin?**
Install it on the Services page (Developer tools), then use the MariaDB card's **Open phpMyAdmin** button or the quick link on Overview. It's also at `http://localhost/phpmyadmin`.

**I switched MariaDB to an older major version and it won't start.**
The data directory was created by the newer version. Switch back. (Separate data per major version is coming soon.)

## Email

**Where do emails go?**
To Mailpit, never to real inboxes. Open the inbox from the Mailpit card or Overview's quick link (`http://localhost:8025`).

**My framework's mail isn't arriving.**
Point its SMTP settings at host `127.0.0.1`, port `1025`, no username or password, no encryption. Settings → Email testing shows the exact values.

## Troubleshooting

**A service won't start.**
Its card explains why and suggests a fix. For port conflicts it names the program using the port. For anything else, Settings → Troubleshooting → **Run diagnostics** produces a report you can share.

**Apache or PHP fails with a missing DLL (Windows).**
Install the Microsoft Visual C++ 2015–2022 Redistributable (x64) from Microsoft. The diagnostics report shows whether it's installed.

**Where are the logs?**
On the Logs page (filter by service, severity and time, and export), and as files in the environment's `logs` folder.

**How do I report a bug?**
Run diagnostics (Settings → Troubleshooting), save the report with "Hide user name and home folder" on, and attach it to an issue on GitHub.
