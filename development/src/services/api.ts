import { Agent, AppSettings } from '../types';

const API_BASE = 'http://localhost:31415/api';

// In-memory initial state for standalone web mode fallback
const defaultSettings: AppSettings = {
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
    currentVersion: 'v1.4.2-rel',
    status: 'up-to-date'
  }
};

let fallbackAgents: Agent[] = [
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

let fallbackSettings = { ...defaultSettings };

export const api = {
  async getSettings(): Promise<AppSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return fallbackSettings;
  },

  async updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    fallbackSettings = { ...fallbackSettings, ...patch };
    return fallbackSettings;
  },

  async getAgents(): Promise<Agent[]> {
    try {
      const res = await fetch(`${API_BASE}/agents`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return [...fallbackAgents];
  },

  async createAgent(data: Partial<Agent>): Promise<Agent> {
    try {
      const res = await fetch(`${API_BASE}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: data.name || 'New Mokko Agent',
      title: data.title || 'AI Autonomous Specialist',
      description: data.description || 'Custom configured Mokko agent instance.',
      avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
      isGroup: !!data.isGroup,
      members: data.members || [],
      notificationsEnabled: true,
      routines: [],
      channels: [
        { id: `ch-${Date.now()}-1`, name: 'Slack', type: 'Slack', connected: false },
        { id: `ch-${Date.now()}-2`, name: 'Discord', type: 'Discord', connected: false }
      ],
      computer: {
        status: 'idle',
        ip: '172.28.0.' + Math.floor(Math.random() * 200 + 10),
        os: 'Ubuntu 24.04 LTS',
        cpu: '8 vCPU',
        memory: '32 GB DDR5',
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
    fallbackAgents.push(newAgent);
    return newAgent;
  },

  async updateAgent(id: string, patch: Partial<Agent>): Promise<Agent> {
    try {
      const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const idx = fallbackAgents.findIndex((a) => a.id === id);
    if (idx !== -1) {
      fallbackAgents[idx] = { ...fallbackAgents[idx], ...patch };
      return fallbackAgents[idx];
    }
    throw new Error('Agent not found');
  },

  async deleteAgent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    fallbackAgents = fallbackAgents.filter((a) => a.id !== id);
    return true;
  },

  async sendMessage(agentId: string, content: string): Promise<{ userMessage: any; replyMessage: any }> {
    try {
      const res = await fetch(`${API_BASE}/agents/${agentId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const userMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const replyMessage = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant' as const,
      content: `I've received your request: "${content}". Environment is executing task in the sandbox.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolCall: content.toLowerCase().includes('run') || content.toLowerCase().includes('test')
        ? { name: 'computer_exec', args: { cmd: 'npm test' }, output: '✓ 48 tests passed in 1.2s' }
        : undefined
    };
    const agent = fallbackAgents.find((a) => a.id === agentId);
    if (agent) {
      agent.transcript.push(userMessage, replyMessage);
    }
    return { userMessage, replyMessage };
  },

  async updateComputer(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/computer/update`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return {
      success: true,
      message: "Mokko's Computer updated. Moved box to a fresh instance keeping files and logins. Installed software must be reinstalled."
    };
  },

  async resetComputer(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/computer/reset`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return {
      success: true,
      message: "Mokko's Computer reset. Restored from the last saved snapshot."
    };
  }
};
