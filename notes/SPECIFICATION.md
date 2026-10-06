# Mokko (formerly Grok Bot) App UI Specification

A compact map of Mokko's real interface so you can guide the user or self-recover. Use only what's listed here; for anything else, follow "Never fabricate data" and say you're unsure rather than inventing a path.

## 1. Opening Settings
- The sidebar account button at the bottom-left (avatar + account name).
- Shortcut: `Cmd+,` (macOS) or `Ctrl+,` (Windows/Linux).
- Command palette (`Cmd+K` / `Ctrl+K`) action: "Open settings".
- *There is no gear icon in the sidebar or macOS Preferences menu item.*

## 2. Deleting an Agent
- The user does this from the sidebar. Right-click the agent's row and choose "Delete" (a permanent delete that removes the agent and its transcript, with a confirm modal).
- *It is not in Settings; there is no archive or hide, just this permanent delete.*

## 3. Settings Tabs & Anchor Links
- **Tabs**: General, Computer, Usage & Billing, Updates.
- *Usage & Billing appears only when enabled for the current account.*

### Anchor Rows:
- **General**:
  - `account`: Account profile card ("Sign In with Cursor" / "Sign Out", user avatar, email).
  - `theme`: Appearance controls ([Theme](mokko://app/v1/settings?id=theme)) with Follow System / Light / Dark.
  - `accent`: Accent color palette.
  - `language`: Interface language selection ([Language](mokko://app/v1/settings?id=language)).
  - `spell-check`: Spell check toggle.
  - `microphone`: Audio input device.
  - `hardware-acceleration`: GPU hardware acceleration toggle.
  - `hardware-acceleration-restart`: Restart prompt to apply hardware acceleration.
  - `network-debugger`: Local API and sandbox network logger.
  - `notification-sound-enabled`: Audible chime toggle.
  - `notification-sound`: Sound tone selector.
  - `timezone`: Timezone configuration for routines.
  - `local-execution`: Host workstation command execution policy.
  - `auto-review`: Automatic diff inspection.
  - `auto-review-rules`: Auto-review custom prompt rules.
  - `security-keys`: Passkeys and hardware security keys.

- **Computer**:
  - `computers`: Registered machines and sandboxes.
  - `update-computer`: **[Update Mokko's Computer]** ([link](mokko://app/v1/settings?id=update-computer)). Button says "Update"; it moves the box to a fresh instance keeping files and logins, but installed software must be reinstalled. Two-click confirm ("Click Again to Confirm").
  - `reset-computer`: **[Reset Mokko's Computer]** ([link](mokko://app/v1/settings?id=reset-computer)). Button says "Reset"; destructive recovery of last resort that restores from the last saved snapshot and can lose recent unsynced work. Users are steered to Update instead.

- **Usage & Billing**:
  - `usage`: Included and on-demand compute meters.
  - `plan`: Active tier and plan controls.
  - `cancel-trial`: Cancel trial button.
  - `on-demand`: Credit refill and auto-topup.
  - `billing`: Payment method and invoice management.

- **Updates**:
  - `update-status`: Current app version status.
  - `update-channel`: Track selector ([Update Track](mokko://app/v1/settings?id=update-channel)) with Stable / Nightly.
  - `automatic-updates`: Background auto-updater toggle.
  - **"Check for Updates"**: Updates the Mokko desktop app itself, distinct from Update Mokko's Computer (which recreates the box).
  - Cross-links to `update-computer` and `reset-computer`.

*Note: Some rows exist only on some accounts, builds, or states; if the user cannot find a row, say so.*

## 4. Per-Agent Info Pane
- Separate from global Settings.
- Open by clicking the agent's name in the chat header or via `Cmd+Shift+I` / `Ctrl+Shift+I`.
- Close with the "X" in the pane's own header.
- Displays:
  - Live preview of that agent's computer (click it to open the full screen view).
  - Routines list with schedule cron and toggles.
  - Channels when a channel connector is available to connect or one is already connected.
  - Members in group chats.
  - Gear icon beside the "X" opens a per-agent Settings subpage (avatar, name, title, description, and per-assistant notifications).
