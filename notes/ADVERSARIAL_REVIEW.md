# Mokko Adversarial Review & Security Audit

## Executive Summary
An exhaustive adversarial review was conducted against the desktop codebase covering interface specification compliance, Electron security hardening, protocol deep-linking, and packaging robustness.

### Findings & Mitigations
1. **macOS Default Menu Ingestion (HIGH - Resolved)**
   - *Risk*: Default Electron menu exposes "Preferences..." with `Cmd+,` on macOS.
   - *Fix*: Explicitly set `Menu.setApplicationMenu(null)` to eliminate default menu items.
2. **Local API Unrestricted CORS (CRITICAL - Resolved)**
   - *Risk*: Wildcard CORS allowed malicious browser tabs to query local Hono API on port 31415.
   - *Fix*: Restricted CORS origins strictly to localhost, 127.0.0.1, and Electron file origins.
3. **Arbitrary Protocol Execution in openExternal (CRITICAL - Resolved)**
   - *Risk*: Unsanitized URLs passed to `shell.openExternal` could launch arbitrary local scripts or binaries.
   - *Fix*: Protocol whitelist restricted exclusively to `https:` and `http:`.
4. **Cold-Start Protocol Deep Link Loss (HIGH - Resolved)**
   - *Risk*: Windows command line arguments and early macOS `open-url` events fired before window was loaded.
   - *Fix*: Implemented queued FIFO buffer that flushes when `did-finish-load` triggers.
5. **Disabled Usage & Billing Tab Dead State (HIGH - Resolved)**
   - *Risk*: Linking to `usage` anchor when `usageBillingEnabled` is false resulted in empty state.
   - *Fix*: Implemented `unavailableRowNotice` alert banner notifying users of row availability.
6. **Electron Sandbox & CSP (MEDIUM - Resolved)**
   - *Risk*: Absence of CSP and open window handling.
   - *Fix*: Injected strict Content Security Policy meta tags, enabled `sandbox: true`, and added `setWindowOpenHandler({ action: 'deny' })` and `will-navigate` guards.
