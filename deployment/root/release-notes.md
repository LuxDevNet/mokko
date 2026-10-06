# Mokko Release v1.0.0

- Rebranded workspace to **Mokko** with high-resolution cyberpunk vector logo.
- Hardened Electron shell:
  - Eliminated macOS Preferences menu item via `Menu.setApplicationMenu(null)`.
  - Whitelisted `open-external` protocols to `https:` and `http:`.
  - Cold-start protocol queue for `mokko://` and `grokbot://` links.
  - Contextual alerts for disabled/unavailable settings rows.
- Single-file NSIS installer built and packaged for Windows x64 and ARM64.
- Portable unpacked binaries available in `win-unpacked/`.
