# Mokko Architecture

```
                 +---------------------------------------------+
                 |              Mokko Desktop Shell            |
                 |               (Electron v33)                |
                 +----------------------+----------------------+
                                        |
                   +--------------------+--------------------+
                   |                                         |
                   v                                         v
       +-----------------------+                 +-----------------------+
       |   Embedded Backend    |                 |     Frontend UI       |
       |      (Hono API)       |                 | (React 18 + Vite 6)   |
       | Port: 127.0.0.1:31415 |                 | Tailwind CSS + Lucide |
       +-----------+-----------+                 +-----------+-----------+
                   |                                         |
                   +--------------------+--------------------+
                                        |
                                        v
                 +---------------------------------------------+
                 |            Agent Sandbox Control            |
                 | (Terminal, Computer Box Update & Reset)     |
                 +---------------------------------------------+
```

## Key Modules
- **`electron/main.ts`**: Lifecycle management, single instance lock, window frame controls, deep-link routing (`mokko://` and `grokbot://`), security traps.
- **`electron/server.ts`**: Embedded Hono server handling agents REST endpoints, chat message execution simulation, computer box updates/resets, and system telemetry.
- **`src/App.tsx`**: Primary workspace controller with keyboard shortcuts (`Cmd+,`, `Cmd+Shift+I`, `Cmd+K`), active agent state, and modal management.
- **`src/components/SettingsModal.tsx`**: Canonical settings interface with four tabs (General, Computer, Usage & Billing, Updates) and anchor highlight routing.
- **`src/components/AgentInfoPane.tsx`**: Per-agent sidebar inspection for computer live view, routines, channels, and member swarms.
