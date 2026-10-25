# Installing lampRabit

> **Status:** installers for every platform are on the GitHub Releases page: https://github.com/Shivam-SV/LambRabit/releases/latest. Windows is fully supported; macOS and Linux are in preview (the app runs, but Apache, Nginx and PHP can't be downloaded there yet; see the table below).

## System requirements

| | Windows | macOS | Linux |
|---|---|---|---|
| OS version | Windows 10 (1809 or later) or Windows 11, 64-bit | macOS 11 Big Sur or later | Ubuntu 22.04+, Debian 12+, Fedora 38+ or similar |
| Web view | Microsoft Edge WebView2 (built into Windows 11; the installer adds it on Windows 10) | Built in | WebKitGTK 4.1 |
| Runtime libraries | Microsoft Visual C++ 2015–2022 Redistributable (x64), needed by Apache and PHP | — | — |
| Disk space | ~150 MB for the app and a basic stack; more for extra versions and databases | | |

### What can be downloaded on each platform

| Runtime | Windows | macOS | Linux |
|---|---|---|---|
| Apache | Yes | Coming soon | Coming soon |
| Nginx | Yes | Coming soon | Coming soon |
| PHP | Yes (8.1–8.5) | Coming soon | Coming soon |
| MariaDB | Yes | Coming soon | Yes |
| Mailpit, phpMyAdmin, Adminer | Yes | Yes | Yes |

## Install

### Windows
1. Download `lampRabit_<version>_x64-setup.exe` (or the `.msi` for managed installs) from the Releases page.
2. Run it. lampRabit installs per user; administrator rights aren't required for the app itself.
3. **"Windows protected your PC"** appears because the installer isn't code-signed yet. Click **More info**, then **Run anyway**.
4. Apache and PHP need the Microsoft Visual C++ 2015–2022 Redistributable (x64). lampRabit checks for it and shows an **Install** button on the Overview page if it's missing.

### macOS
1. Download `lampRabit_<version>_aarch64.dmg` (Apple Silicon: M1 and later) or `lampRabit_<version>_x64.dmg` (Intel).
2. Open it and drag lampRabit to Applications.
3. Open lampRabit. Because it isn't signed yet, macOS says it can't be opened: go to **System Settings → Privacy & Security**, scroll down and click **Open Anyway**, then confirm. (Or right-click the app in Applications and choose **Open**.) You only need to do this once.

### Linux
- **AppImage:** download `lampRabit_<version>_amd64.AppImage`, make it executable (`chmod +x lampRabit_*.AppImage`) and run it.
- **Debian/Ubuntu:** `sudo apt install ./lampRabit_<version>_amd64.deb`

## First run

1. **Environment folder.** lampRabit keeps everything in one folder: `C:\lampRabit` on Windows, `~/lampRabit` on macOS and Linux. You can change it in Settings → General. Inside it:

   ```
   bin/    downloaded runtimes (Apache, PHP, MariaDB, ...)
   etc/    generated configuration
   www/    your projects: one folder per site
   data/   databases
   logs/   all log files
   ssl/    local certificate authority and site certificates
   tmp/    sessions, uploads, temporary files
   ```

2. **Install your stack.** Open **Services** and install Apache (or Nginx), PHP and MariaDB. The first version you install of each becomes the active one.
3. **Start.** Click **Start all** in the title bar.
4. **Create a site.** Click **Open www**, create a folder such as `hello`, and add `index.php`:

   ```php
   <?php phpinfo();
   ```

5. **Add it to the hosts file.** On the Sites page, click **Apply changes** (or restart Apache). Windows asks for administrator approval once; approve it. From then on the hosts file is updated automatically when Apache starts and the site list has changed.
6. **Trust the certificate.** On the Sites page, click **Trust certificate** and confirm. Restart your browser if it was open.
7. Open `https://hello.test`.

### Optional
- **Developer tools:** Services → Developer tools → install phpMyAdmin, Adminer and Mailpit.
- **No hosts file:** set the domain suffix to `localhost` in Settings. Sites become `hello.localhost` and browsers resolve them without the hosts file.

## Firefox and HTTPS

Firefox keeps its own certificate list. To make it trust lampRabit's certificates, open `about:config`, set `security.enterprise_roots.enabled` to `true`, and restart Firefox. Chrome, Edge, Brave and Safari use the system certificate store and work after **Trust certificate**.

On Linux, browsers use various certificate stores; lampRabit shows the certificate file (`ssl/ca/lampRabit-ca.crt`) to import. For the system store: `sudo cp lampRabit-ca.crt /usr/local/share/ca-certificates/lampRabit.crt && sudo update-ca-certificates`.

## Ports used

| Service | Default port | Change in |
|---|---|---|
| Apache (or Nginx alone) | 80, 443 | Settings → Ports |
| Nginx next to Apache | 8080, 8443 | Settings → Ports |
| MariaDB | 3306 | Settings → Ports |
| PHP FastCGI workers | 9000 and up (10 per PHP version) | Settings → Ports |
| Mailpit SMTP / inbox | 1025 / 8025 | Settings → Email testing |

## Uninstall

1. Click **Stop all**, then quit lampRabit.
2. Uninstall the app (Windows: Settings → Apps; macOS: drag to Trash; Linux: `sudo apt remove lamprabit` or delete the AppImage).
3. Delete the environment folder (`C:\lampRabit` or `~/lampRabit`) if you don't need your projects and databases. **Back up `www/` and your databases first.**
4. Remove the certificate authority:
   - Windows: run `certmgr.msc` → Trusted Root Certification Authorities → Certificates → delete **lampRabit Local CA**.
   - macOS: Keychain Access → login → delete **lampRabit Local CA**.
5. Remove the hosts entries: delete the block between `# lampRabit begin` and `# lampRabit end` in the hosts file (Windows: `C:\Windows\System32\drivers\etc\hosts`, as administrator; macOS/Linux: `/etc/hosts` with `sudo`).

## Building from source

For contributors and early testers.

1. Install [Node.js](https://nodejs.org) 20 or later and [Rust](https://rustup.rs) (stable).
2. Platform prerequisites for Tauri:
   - Windows: Visual Studio 2022 Build Tools with the "Desktop development with C++" workload; WebView2 (built into Windows 11).
   - macOS: Xcode Command Line Tools (`xcode-select --install`).
   - Linux: WebKitGTK 4.1 and build tools, see https://tauri.app/start/prerequisites/
3. Clone and run:

   ```bash
   git clone https://github.com/Shivam-SV/LambRabit.git
   cd LambRabit
   npm install
   npm run tauri dev
   ```

4. Build an installer for your platform: `npm run tauri build`.
