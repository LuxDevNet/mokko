import { Hono } from 'hono';
import { serve } from '@hono/node-server';

export interface Agent {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  isGroup?: boolean;
  members?: string[];
  notificationsEnabled: boolean;
  routines: { id: string; name: string; cron: string; enabled: boolean }[];
  channels: { id: string; name: string; type: string; connected: boolean }[];
  computer: {
    status: 'idle' | 'running' | 'updating' | 'resetting';
    ip: string;
    os: string;
    cpu: string;
    memory: string;
    screenThumbnail?: string;
    lastSynced: string;
  };
  transcript: {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    timestamp: string;
    toolCall?: { name: string; args: Record<string, any>; output?: string };
  }[];
}

export interface AppSettings {
  account: {
    signedIn: boolean;
    name: string;
    email: string;
    avatar: string;
    provider: 'Cursor' | 'None';
  };
  theme: 'system' | 'light' | 'dark';
  accent: string;
  language: string;
  spellCheck: boolean;
  microphone: string;
  hardwareAcceleration: boolean;
  networkDebugger: boolean;
  notificationSoundEnabled: boolean;
  notificationSound: string;
  timezone: string;
  localExecution: boolean;
  autoReview: boolean;
  autoReviewRules: string;
  securityKeys: { id: string; name: string; created: string }[];
  computers: { id: string; name: string; status: string; ip: string; updated: string }[];
  usageBillingEnabled: boolean;
  usage: {
    includedHoursUsed: number;
    includedHoursTotal: number;
    onDemandCredits: number;
    plan: string;
    renewsAt: string;
  };
  updates: {
    channel: 'stable' | 'nightly';
    automaticUpdates: boolean;
    currentVersion: string;
    status: 'up-to-date' | 'checking' | 'available' | 'downloading';
  };
}

let settings: AppSettings = {
  account: {
    signedIn: true,
    name: "Alex Vance",
    email: "alex@developer.net",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
    provider: "Cursor"
  },
  theme: 'dark',
  accent: '#3b82f6',
  language: 'English (US)',
  spellCheck: true,
  microphone: 'Default - HyperX SoloCast',
  hardwareAcceleration: true,
  networkDebugger: false,
  notificationSoundEnabled: true,
  notificationSound: 'Subtle Chime',
  timezone: 'America/Los_Angeles (UTC-7)',
  localExecution: true,
  autoReview: true,
  autoReviewRules: 'Lint and security checks on all terminal runs',
  securityKeys: [
    { id: 'key_1', name: 'MacBook Touch ID / Windows Hello', created: '2026-03-12' },
    { id: 'key_2', name: 'YubiKey 5C NFC', created: '2026-05-19' }
  ],
  computers: [
    { id: 'box-01', name: "Mokko Cloud Box #1", status: 'Online', ip: '192.168.10.42', updated: '2 hours ago' },
    { id: 'box-02', name: "Local Sandbox VM", status: 'Standby', ip: '127.0.0.1:8888', updated: '1 day ago' }
  ],
  usageBillingEnabled: true,
  usage: {
    includedHoursUsed: 142.5,
    includedHoursTotal: 250,
    onDemandCredits: 48.00,
    plan: 'Mokko Pro (Early Access)',
    renewsAt: 'Nov 1, 2026'
  },
  updates: {
    channel: 'stable',
    automaticUpdates: true,
    currentVersion: 'v1.0.0-rel',
    status: 'up-to-date'
  }
};

let agents: Agent[] = [
  {
    id: 'agent-primary',
    name: 'Mokko Assistant',
    title: 'Lead Autonomous Engineer',
    description: 'Main general-purpose assistant with computer use and full workspace access.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mokko1',
    isGroup: false,
    notificationsEnabled: true,
    routines: [
      { id: 'rt-1', name: 'Morning Code Lint & PR Sync', cron: '0 9 * * 1-5', enabled: true },
      { id: 'rt-2', name: 'Docker Cleanup & Snapshot Save', cron: '0 23 * * *', enabled: false }
    ],
    channels: [
      { id: 'ch-1', name: 'Slack (#eng-automation)', type: 'Slack', connected: true },
      { id: 'ch-2', name: 'Discord (Dev Guild)', type: 'Discord', connected: false },
      { id: 'ch-3', name: 'GitHub Webhooks', type: 'GitHub', connected: true }
    ],
    computer: {
      status: 'idle',
      ip: '172.28.0.2',
      os: 'Ubuntu 24.04 LTS (x86_64)',
      cpu: '8 vCPU / AMD EPYC',
      memory: '32 GB DDR5',
      screenThumbnail: 'desktop_preview_active',
      lastSynced: 'Just now'
    },
    transcript: [
      {
        id: 'msg-1',
        role: 'system',
        content: 'Agent workspace initialized. Computer environment connected to Mokko Cloud Box.',
        timestamp: '10:00 AM'
      },
      {
        id: 'msg-2',
        role: 'user',
        content: 'Check system health and review recent unit tests in this repo.',
        timestamp: '10:01 AM'
      },
      {
        id: 'msg-3',
        role: 'assistant',
        content: 'I will inspect the workspace, execute test suites, and report the results.',
        timestamp: '10:01 AM',
        toolCall: {
          name: 'computer_exec',
          args: { command: 'npm test -- --reporter=verbose' },
          output: '✓ 48 tests passed (1.2s)\n✓ All suites green.'
        }
      }
    ]
  },
  {
    id: 'agent-code-reviewer',
    name: 'Security & Auto-Reviewer',
    title: 'Automated Inspector',
    description: 'Specialized bot for diff analysis, vulnerability scanning, and routine maintenance.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Inspector',
    isGroup: false,
    notificationsEnabled: false,
    routines: [
      { id: 'rt-3', name: 'Nightly CVE Scan', cron: '0 2 * * *', enabled: true }
    ],
    channels: [
      { id: 'ch-4', name: 'GitHub Pull Requests', type: 'GitHub', connected: true }
    ],
    computer: {
      status: 'idle',
      ip: '172.28.0.5',
      os: 'Debian 12 Bookworm',
      cpu: '4 vCPU',
      memory: '16 GB DDR5',
      screenThumbnail: 'desktop_preview_security',
      lastSynced: '15 mins ago'
    },
    transcript: [
      {
        id: 'msg-sec-1',
        role: 'assistant',
        content: 'Awaiting your instructions or trigger commits.',
        timestamp: '09:30 AM'
      }
    ]
  },
  {
    id: 'agent-devops-group',
    name: 'DevOps Swarm',
    title: 'Group Agent',
    description: 'Collaborative group agent coordinating multi-container deployments.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DevOpsGroup',
    isGroup: true,
    members: ['Alex Vance', 'Mokko Assistant', 'Security & Auto-Reviewer'],
    notificationsEnabled: true,
    routines: [],
    channels: [
      { id: 'ch-5', name: 'Telegram (@infra_alerts)', type: 'Telegram', connected: false }
    ],
    computer: {
      status: 'idle',
      ip: '172.28.0.8',
      os: 'Fedora CoreOS',
      cpu: '16 vCPU',
      memory: '64 GB DDR5',
      screenThumbnail: 'desktop_preview_cluster',
      lastSynced: '1 hour ago'
    },
    transcript: [
      {
        id: 'msg-g-1',
        role: 'system',
        content: 'Group chat created with members Alex Vance, Mokko Assistant, Security & Auto-Reviewer.',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export function createHonoApp() {
  const app = new Hono();

  // CORS middleware for renderer requests
  app.use('*', async (c, next) => {
    const origin = c.req.header('origin') || '';
    const isAllowed = !origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin.startsWith('file://');
    if (isAllowed) {
      c.header('Access-Control-Allow-Origin', origin || '*');
    }
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (c.req.method === 'OPTIONS') {
      return c.body(null, 204);
    }
    await next();
  });

  app.get('/api/health', (c) => c.json({ status: 'ok', service: 'Mokko Core API' }));

  // Settings
  app.get('/api/settings', (c) => c.json(settings));
  app.put('/api/settings', async (c) => {
    const body = await c.req.json();
    settings = { ...settings, ...body };
    return c.json(settings);
  });

  // Agents
  app.get('/api/agents', (c) => c.json(agents));

  app.get('/api/agents/:id', (c) => {
    const id = c.req.param('id');
    const agent = agents.find((a) => a.id === id);
    if (!agent) return c.json({ error: 'Agent not found' }, 404);
    return c.json(agent);
  });

  app.post('/api/agents', async (c) => {
    const body = await c.req.json();
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: body.name || 'New Mokko Agent',
      title: body.title || 'AI Autonomous Specialist',
      description: body.description || 'Custom configured Mokko agent instance.',
      avatar: body.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
      isGroup: !!body.isGroup,
      members: body.members || [],
      notificationsEnabled: true,
      routines: [],
      channels: [
        { id: `ch-${Date.now()}-1`, name: 'Slack', type: 'Slack', connected: false },
        { id: `ch-${Date.now()}-2`, name: 'Discord', type: 'Discord', connected: false },
        { id: `ch-${Date.now()}-3`, name: 'GitHub', type: 'GitHub', connected: false }
      ],
      computer: {
        status: 'idle',
        ip: '172.28.0.' + Math.floor(Math.random() * 200 + 10),
        os: 'Ubuntu 24.04 LTS',
        cpu: '8 vCPU',
        memory: '32 GB DDR5',
        screenThumbnail: 'desktop_preview_active',
        lastSynced: 'Just now'
      },
      transcript: [
        {
          id: `msg-${Date.now()}-init`,
          role: 'system',
          content: 'Agent workspace created and ready.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    agents.push(newAgent);
    return c.json(newAgent, 201);
  });

  app.put('/api/agents/:id', async (c) => {
    const id = c.req.param('id');
    const index = agents.findIndex((a) => a.id === id);
    if (index === -1) return c.json({ error: 'Agent not found' }, 404);
    const body = await c.req.json();
    agents[index] = { ...agents[index], ...body };
    return c.json(agents[index]);
  });

  // Permanent Delete Agent (removes agent and its transcript)
  app.delete('/api/agents/:id', (c) => {
    const id = c.req.param('id');
    const initialLen = agents.length;
    agents = agents.filter((a) => a.id !== id);
    if (agents.length === initialLen) {
      return c.json({ error: 'Agent not found' }, 404);
    }
    return c.json({ success: true, deletedId: id });
  });

  // Chat message send
  app.post('/api/agents/:id/chat', async (c) => {
    const id = c.req.param('id');
    const agent = agents.find((a) => a.id === id);
    if (!agent) return c.json({ error: 'Agent not found' }, 404);

    const body = await c.req.json();
    const userMsg = {
      id: `msg-${Date.now()}-u`,
      role: 'user' as const,
      content: body.content || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    agent.transcript.push(userMsg);

    // Generate responsive Mokko answer with simulated actions
    const promptLower = (body.content || '').toLowerCase();
    let replyContent = "I'm on it. Processing your request in the sandbox environment.";
    let toolCall = undefined;

    if (promptLower.includes('update') || promptLower.includes('reinstall')) {
      replyContent = "I've checked the environment. Note that 'Update Mokko's Computer' moves this box to a fresh instance keeping files and logins, but packages need reinstallation. App updates can be performed from the Updates tab.";
    } else if (promptLower.includes('routine') || promptLower.includes('cron')) {
      replyContent = "I checked the agent's Routines list. You can schedule recurring jobs or inspections in the per-agent info pane.";
    } else if (promptLower.includes('test') || promptLower.includes('run')) {
      toolCall = {
        name: 'terminal_exec',
        args: { cmd: 'vitest run --coverage' },
        output: '✓ 124 tests passed across 18 suites\nCoverage: 98.4%'
      };
      replyContent = "I ran the test suite inside the agent's computer box. All 124 unit tests passed successfully.";
    } else {
      replyContent = `Understood. Working on "${body.content.slice(0, 45)}...". Computer state is active and monitoring filesystem changes.`;
    }

    const aiMsg = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant' as const,
      content: replyContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolCall
    };
    agent.transcript.push(aiMsg);

    return c.json({ userMessage: userMsg, replyMessage: aiMsg });
  });

  // Computer Actions: Update Mokko's Computer (two-click confirm in UI)
  app.post('/api/computer/update', (c) => {
    return c.json({
      success: true,
      message: "Mokko's Computer updated. Moved box to a fresh instance keeping files and logins. Reinstalled baseline developer tools."
    });
  });

  // Computer Actions: Reset Mokko's Computer (destructive recovery of last resort)
  app.post('/api/computer/reset', (c) => {
    return c.json({
      success: true,
      message: "Mokko's Computer reset. Restored from the last saved snapshot."
    });
  });

  return app;
}

export function startHonoServer(port = 31415) {
  const app = createHonoApp();
  try {
    const server = serve({
      fetch: app.fetch,
      port,
    });
    console.log(`[Hono] Mokko API server running on http://127.0.0.1:${port}`);
    return server;
  } catch (err) {
    console.error('[Hono] Failed to start server:', err);
    return null;
  }
}
