export interface Agent {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  isGroup?: boolean;
  members?: string[];
  notificationsEnabled: boolean;
  routines: Routine[];
  channels: ChannelConnector[];
  computer: AgentComputer;
  transcript: ChatMessage[];
}

export interface Routine {
  id: string;
  name: string;
  cron: string;
  enabled: boolean;
}

export interface ChannelConnector {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export interface AgentComputer {
  status: 'idle' | 'running' | 'updating' | 'resetting';
  ip: string;
  os: string;
  cpu: string;
  memory: string;
  screenThumbnail?: string;
  lastSynced: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: string;
  toolCall?: {
    name: string;
    args: Record<string, any>;
    output?: string;
  };
}

export interface SecurityKey {
  id: string;
  name: string;
  created: string;
}

export interface RegisteredComputer {
  id: string;
  name: string;
  status: string;
  ip: string;
  updated: string;
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
  securityKeys: SecurityKey[];
  computers: RegisteredComputer[];
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

export type SettingsTabId = 'general' | 'computer' | 'usage-billing' | 'updates';
