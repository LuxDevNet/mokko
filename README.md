# Mokko Desktop

A high-fidelity desktop workspace for autonomous agents with sandboxed computer environments, built with **Electron**, **Hono**, **Vite**, **React**, and **Tailwind CSS**. Packaged as a single-file **NSIS** installer for Windows x64 & ARM64, macOS, and Linux.

---

## 📁 Repository Organization

The repository is structured into 3 dedicated directories with deployment kept clean and distinct, plus the single-file NSIS installer directly at the root:

```text
grok-dupe/
├── Mokko Setup 1.0.0.exe        <-- Standalone Single-File NSIS Windows Installer (85 MB)
├── package.json                 <-- Root workspace runner (delegates npm run dev/build/dist)
├── README.md                    <-- Project guide and real paths documentation
├── development/                 <-- [1/3] Development Source & Configurations
│   ├── src/                     <-- React UI components, state, hooks, API client
│   ├── electron/                <-- Electron main/preload processes and embedded Hono API
│   ├── public/                  <-- Brand logo and app assets
│   ├── build/                   <-- App icon (icon.png)
│   ├── index.html               <-- Vite HTML template
│   ├── vite.config.ts           <-- Vite bundler configuration
│   ├── tsconfig.json            <-- TypeScript configurations
│   ├── tailwind.config.js       <-- Tailwind styling config
│   └── package.json             <-- Standalone build and dependency configuration
├── notes/                       <-- [2/3] Documentation, Reviews & Architecture
│   ├── SPECIFICATION.md         <-- Exact interface path mapping & requirements
│   ├── ADVERSARIAL_REVIEW.md    <-- 5-stage critical review & hardening audit
│   ├── ARCHITECTURE.md          <-- IPC, embedded Hono microservice, security boundaries
│   └── PACKAGING_GUIDE.md       <-- Multi-platform cross-compilation & NSIS instructions
└── deployment/                  <-- [3/3] Deployment Pipeline & Release Artifacts
    ├── dist/                    <-- Production release builds
    │   ├── Mokko Setup 1.0.0.exe
    │   ├── Mokko Setup 1.0.0.exe.blockmap
    │   └── win-unpacked/        <-- Unpacked portable binary directory
    └── root/                    <-- Deployment manifests and automation scripts
        ├── deployment-manifest.json
        ├── install.bat
        ├── release-notes.md
        └── builder-debug.yml
```

---

## 🌟 Quick Start

### Run Installer Directly
Run `.\Mokko Setup 1.0.0.exe` at the folder root to install and launch Mokko immediately.

### Run in Development Mode
```bash
# From workspace root or within development/
npm run dev:electron
```

### Build Single-File NSIS Installer
```bash
# Generates the NSIS installer in deployment/dist
npm run dist
```

---

## 🧭 Mokko Interface Map & Canonical Paths

This application strictly matches the real interface specification:

### 1. Opening Settings
- **Primary entrance**: The **sidebar account button at bottom-left** (`avatar + account name`).
- **Keyboard shortcut**: `Cmd+,` (macOS) or `Ctrl+,` (Windows/Linux).
- **Command Palette**: `Cmd+K` / `Ctrl+K` -> choose **"Open settings"**.
- *Note: There is intentionally no gear icon in the sidebar or macOS Preferences menu item.*

### 2. Deleting an Agent
- Done strictly from the **sidebar**. Right-click any agent row and select **"Delete"**.
- Shows a confirmation modal. This is a **permanent delete** that removes the agent and its complete transcript history.
- *There is no archive or hide, and it is not in Settings.*

### 3. Settings Tabs & Anchor Links
Every settings row supports direct deep-linking via `mokko://app/v1/settings?id=<id>` (or `grokbot://`) with automatic tab switching, smooth scroll, and pulsing visual highlight:

#### General Tab
- `account`: Account card with "Sign In with Cursor" / "Sign Out", user avatar, email.
- `theme`: Theme controls (`mokko://app/v1/settings?id=theme`) with **Follow System**, **Light**, and **Dark**.
- `accent`: Accent color selector.
- `language`: Interface language picker (`mokko://app/v1/settings?id=language`).
- `spell-check`: Spell checking toggle for message inputs.
- `microphone`: Audio input source selector.
- `hardware-acceleration`: GPU acceleration toggle.
- `hardware-acceleration-restart`: Restart prompt banner for hardware acceleration.
- `network-debugger`: In-app network packet inspector toggle.
- `notification-sound-enabled`: System chime toggle.
- `notification-sound`: Custom sound picker.
- `timezone`: Timezone configuration.
- `local-execution`: Local sandbox compute switcher.
- `auto-review`: Autonomous code review engine toggle.
- `auto-review-rules`: Custom linter/review rules configuration.
- `security-keys`: Hardware security key management.

#### Computer Tab
- `computers`: List of registered machines and status cards.
- **Recovery Row 1**: `update-computer` -> **"Update Mokko's Computer"**
  - Primary button labeled **"Update"**.
  - Requires a **two-click confirmation** ("Click Again to Confirm").
  - Moves the box to a fresh instance keeping files and logins, but installed software must be reinstalled.
- **Recovery Row 2**: `reset-computer` -> **"Reset Mokko's Computer"**
  - Button labeled **"Reset"** (warning colored).
  - Destructive recovery of last resort: restores from the last saved snapshot and can lose recent unsynced work.
  - UI actively steers users toward "Update" instead.

#### Usage & Billing Tab (Conditional)
- Only appears when `usageAndBillingEnabled` is `true` for the current account.
- When an account without this permission deep links to this tab, a banner gracefully explains: *"Some rows exist only on some accounts, builds, or states."*
- `usage`: Visual quota bar and token counters.
- `plan`: Plan switcher (Pro, Enterprise, Team).
- `cancel-trial`: Trial management.
- `on-demand`: On-demand credit toggles.
- `billing`: Payment method and invoice history.

#### Updates Tab
- `update-status`: Current app version (v1.0.0) and "Check for Updates" button (updates the desktop app itself, distinct from box recovery).
- `update-channel`: Track switcher (**Stable** / **Nightly**).
- `automatic-updates`: Background auto-download toggle.
- `update-computer`: In-updates shortcut to box update.
- `reset-computer`: In-updates shortcut to box reset.

---

### 4. Per-Agent Info Pane (Separate from Global Settings)
- **Open**: Click the agent's name in the chat header or press `Cmd+Shift+I` / `Ctrl+Shift+I`.
- **Close**: Click the **"X"** in the pane's header.
- **Live Preview of Agent's Computer**: Shows interactive screen preview; clicking it opens the full-screen view.
- **Routines**: List of automated schedules and triggers for the agent.
- **Channels**: Channel connector list (Slack, Discord, Telegram, Webhook) showing connection state.
- **Members**: Collaborative participants in group conversations.
- **Per-Agent Settings**: Opened via the **gear icon beside the "X"** in the pane header (avatar, name, title, description, per-assistant notifications).
