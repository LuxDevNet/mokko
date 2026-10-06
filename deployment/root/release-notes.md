# 🚀 Mokko Desktop v1.0.0

A high-fidelity desktop workspace for autonomous agents with sandboxed computer environments, built with **Electron**, **Hono**, **Vite**, **React**, and **Tailwind CSS**.

---

### ✨ Highlights

- **Rebranded Identity**: Full transformation to **Mokko** with bespoke cyberpunk holographic logo and glassmorphic obsidian UI.
- **Strict Canonical Interface Mapping**:
  - Sidebar bottom-left account button (`avatar + name`) with `Cmd+,` and Command Palette shortcuts (**no gear icon in sidebar, no macOS Preferences menu item**).
  - Permanent agent deletion strictly via sidebar right-click context menu.
  - 4 canonical settings tabs: `General`, `Computer`, `Usage & Billing` (conditional), and `Updates`.
  - Machine box recovery: Safe two-click confirm **Update Mokko's Computer** vs destructive **Reset Mokko's Computer**.
  - Per-agent info pane (`Cmd+Shift+I`) with live computer preview, routines, channel connectors, and members.
- **Embedded Hono API**:
  - In-process HTTP & RPC microservice on `127.0.0.1:31415` with origin-restricted CORS security.
- **Deep Linking**:
  - Protocol registration for `mokko://app/v1/settings?id=<row>` with cold-start queuing and backwards compatibility for `grokbot://`.
- **Single-File NSIS Packaging**:
  - Packaged with `electron-builder` for one-click installation and automatic start menu shortcuts.

---

### 📦 Release Assets

- **`Mokko Setup 1.0.0.exe`**: Standalone single-file Windows NSIS installer (~85 MB)
