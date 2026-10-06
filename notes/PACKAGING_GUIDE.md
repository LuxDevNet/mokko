# Mokko Packaging & Deployment Guide

## Supported Platforms & Formats
- **Windows (x64 & ARM64)**: Single-file NSIS Installer (`.exe`)
- **macOS (Intel, Apple Silicon, Universal)**: `.dmg` and `.zip`
- **Linux (x64 & ARM64)**: `.AppImage` and `.deb`

## Build Commands
```bash
# Compile and build Windows NSIS installer
npm run dist

# Compile and build Windows ARM64 installer
npm run dist:win-arm

# Package all target platforms
npm run dist:all
```

## NSIS Installer Specifications
- **Single-file executable**: Self-extracting setup package.
- **Protocol Registration**: Binds `mokko://` (and alias `grokbot://`) to the installed executable.
- **User Installation**: Per-user setup by default with custom folder selection.
- **Clean Uninstall**: Generates uninstaller and removes shortcuts cleanly.
