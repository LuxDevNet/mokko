import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, SettingsTabId } from '../types';
import {
  X,
  User,
  Monitor,
  CreditCard,
  RefreshCw,
  Sliders,
  Shield,
  Volume2,
  Cpu,
  AlertTriangle,
  Check,
  Sparkles,
  Link2,
  Info,
  ExternalLink,
  Laptop
} from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  initialAnchorId?: string;
  onTriggerUpdateComputer: () => Promise<void>;
  onTriggerResetComputer: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
  initialAnchorId,
  onTriggerUpdateComputer,
  onTriggerResetComputer,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('general');
  const [highlightedAnchor, setHighlightedAnchor] = useState<string | null>(null);

  // Two-click confirm state for [Update Mokko's Computer]
  const [updateConfirmPending, setUpdateConfirmPending] = useState(false);
  const [isUpdatingComputer, setIsUpdatingComputer] = useState(false);
  const [updateSuccessBanner, setUpdateSuccessBanner] = useState<string | null>(null);

  // Reset computer state
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [isResettingComputer, setIsResettingComputer] = useState(false);
  const [resetSuccessBanner, setResetSuccessBanner] = useState<string | null>(null);

  // App update checking state
  const [checkingAppUpdates, setCheckingAppUpdates] = useState(false);
  const [appUpdateMessage, setAppUpdateMessage] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [unavailableRowNotice, setUnavailableRowNotice] = useState<string | null>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Map anchors to their corresponding tab
  const getTabForAnchor = (anchor: string): SettingsTabId => {
    const generalAnchors = [
      'account', 'theme', 'accent', 'language', 'spell-check', 'microphone',
      'hardware-acceleration', 'hardware-acceleration-restart', 'network-debugger',
      'notification-sound-enabled', 'notification-sound', 'timezone',
      'local-execution', 'auto-review', 'auto-review-rules', 'security-keys'
    ];
    const computerAnchors = ['computers', 'update-computer', 'reset-computer'];
    const usageAnchors = ['usage', 'plan', 'cancel-trial', 'on-demand', 'billing'];
    const updateAnchors = ['update-status', 'update-channel', 'automatic-updates', 'check-for-updates'];

    if (computerAnchors.includes(anchor)) return 'computer';
    if (usageAnchors.includes(anchor)) return 'usage-billing';
    if (updateAnchors.includes(anchor)) return 'updates';
    if (generalAnchors.includes(anchor)) return 'general';
    return 'general';
  };

  useEffect(() => {
    if (!isOpen) return;

    if (initialAnchorId) {
      const allKnownAnchors = [
        'account', 'theme', 'accent', 'language', 'spell-check', 'microphone',
        'hardware-acceleration', 'hardware-acceleration-restart', 'network-debugger',
        'notification-sound-enabled', 'notification-sound', 'timezone',
        'local-execution', 'auto-review', 'auto-review-rules', 'security-keys',
        'computers', 'update-computer', 'reset-computer',
        'usage', 'plan', 'cancel-trial', 'on-demand', 'billing',
        'update-status', 'update-channel', 'automatic-updates', 'check-for-updates'
      ];
      const usageAnchors = ['usage', 'plan', 'cancel-trial', 'on-demand', 'billing'];

      if (!allKnownAnchors.includes(initialAnchorId)) {
        setUnavailableRowNotice(`The requested row "${initialAnchorId}" was not found. Some rows exist only on some accounts, builds, or states.`);
      } else if (usageAnchors.includes(initialAnchorId) && !settings.usageBillingEnabled) {
        setUnavailableRowNotice(`The row "${initialAnchorId}" is in Usage & Billing, which is currently not enabled for this account.`);
      } else {
        setUnavailableRowNotice(null);
      }

      const targetTab = getTabForAnchor(initialAnchorId);
      setActiveTab(targetTab);
      setHighlightedAnchor(initialAnchorId);

      // Scroll after render
      setTimeout(() => {
        const el = document.getElementById(initialAnchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      // Clear highlight after 3.5s
      const timer = setTimeout(() => {
        setHighlightedAnchor(null);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setUnavailableRowNotice(null);
    }
  }, [isOpen, initialAnchorId, settings.usageBillingEnabled]);

  // Reset two-click timeout after 5 seconds if not confirmed
  useEffect(() => {
    if (updateConfirmPending) {
      const timer = setTimeout(() => {
        setUpdateConfirmPending(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateConfirmPending]);

  if (!isOpen) return null;

  const handleCopyAnchorLink = (anchorId: string) => {
    const url = `mokko://app/v1/settings?id=${anchorId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(anchorId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleUpdateComputerClick = async () => {
    if (!updateConfirmPending) {
      setUpdateConfirmPending(true);
      return;
    }
    // Confirmed second click!
    setUpdateConfirmPending(false);
    setIsUpdatingComputer(true);
    setUpdateSuccessBanner(null);
    try {
      await onTriggerUpdateComputer();
      setUpdateSuccessBanner("Mokko's Computer was updated. Box moved to a fresh instance. Files and logins preserved.");
    } finally {
      setIsUpdatingComputer(false);
      setTimeout(() => setUpdateSuccessBanner(null), 8000);
    }
  };

  const handleResetComputerConfirm = async () => {
    setResetConfirmOpen(false);
    setIsResettingComputer(true);
    setResetSuccessBanner(null);
    try {
      await onTriggerResetComputer();
      setResetSuccessBanner("Mokko's Computer was reset to the last saved snapshot.");
    } finally {
      setIsResettingComputer(false);
      setTimeout(() => setResetSuccessBanner(null), 8000);
    }
  };

  const handleCheckForAppUpdates = () => {
    setCheckingAppUpdates(true);
    setAppUpdateMessage(null);
    setTimeout(() => {
      setCheckingAppUpdates(false);
      setAppUpdateMessage("Mokko desktop app is on the latest version (v1.0.0-rel).");
      setTimeout(() => setAppUpdateMessage(null), 6000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl h-[88vh] bg-[#121417] border border-[#2b303a] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Settings Header */}
        <div className="h-12 bg-[#16181c] border-b border-[#252a33] px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-100">Settings</h2>
            <span className="text-[11px] text-zinc-500 font-mono">mokko://app/v1/settings</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            title="Close Settings (ESC or Cmd+,)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body with Navigation Tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <nav className="w-52 bg-[#0e1013] border-r border-[#22252a] p-3 space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'general'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181a1f]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('computer')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'computer'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181a1f]'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Computer</span>
            </button>

            {/* Usage & Billing appears only when enabled for current account */}
            {settings.usageBillingEnabled && (
              <button
                onClick={() => setActiveTab('usage-billing')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  activeTab === 'usage-billing'
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181a1f]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Usage & Billing</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('updates')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === 'updates'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181a1f]'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Updates</span>
            </button>
          </nav>

          {/* Right Content Area */}
          <div
            ref={contentContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300"
          >
            {unavailableRowNotice && (
              <div className="p-3 bg-amber-950/60 border border-amber-800 text-amber-200 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{unavailableRowNotice}</span>
                </div>
                <button
                  onClick={() => setUnavailableRowNotice(null)}
                  className="text-amber-400 hover:text-white p-1 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* GENERAL TAB                                                               */}
            {/* ========================================================================= */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">General Settings</h3>
                  <p className="text-xs text-zinc-500">
                    Account profile, appearance preferences, system controls, and security keys.
                  </p>
                </div>

                {/* anchor: account */}
                <div
                  id="account"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl transition-all ${
                    highlightedAnchor === 'account' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Account</span>
                      <button
                        onClick={() => handleCopyAnchorLink('account')}
                        className="text-zinc-500 hover:text-blue-400"
                        title="Copy anchor link"
                      >
                        <Link2 className="w-3 h-3" />
                      </button>
                      {copiedLink === 'account' && (
                        <span className="text-[10px] text-emerald-400">Copied!</span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500">Connected with {settings.account.provider}</span>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={settings.account.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{settings.account.name}</div>
                        <div className="text-xs text-zinc-400">{settings.account.email}</div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onUpdateSettings({
                          account: {
                            ...settings.account,
                            signedIn: !settings.account.signedIn,
                            provider: settings.account.signedIn ? 'None' : 'Cursor',
                          },
                        })
                      }
                      className="px-3 py-1.5 rounded text-xs font-medium border border-zinc-700 hover:bg-zinc-800 transition-colors text-zinc-200"
                    >
                      {settings.account.signedIn ? 'Sign Out' : 'Sign In with Cursor'}
                    </button>
                  </div>
                </div>

                {/* Appearance section: theme & accent & language */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Appearance</h4>

                  {/* anchor: theme */}
                  <div
                    id="theme"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'theme' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Theme</span>
                        <button
                          onClick={() => handleCopyAnchorLink('theme')}
                          className="text-zinc-500 hover:text-blue-400"
                          title="Copy mokko://app/v1/settings?id=theme link"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                        {copiedLink === 'theme' && (
                          <span className="text-[10px] text-emerald-400">Copied!</span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500">Select application color mode</p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#101215] p-1 rounded border border-zinc-800 text-xs">
                      {(['system', 'light', 'dark'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => onUpdateSettings({ theme: t })}
                          className={`px-2.5 py-1 rounded capitalize transition-colors ${
                            settings.theme === t
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {t === 'system' ? 'Follow System' : t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* anchor: accent */}
                  <div
                    id="accent"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'accent' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Accent Color</span>
                        <button
                          onClick={() => handleCopyAnchorLink('accent')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Highlight accents across buttons and active tabs</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
                        <button
                          key={c}
                          onClick={() => onUpdateSettings({ accent: c })}
                          style={{ backgroundColor: c }}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            settings.accent === c ? 'border-white scale-110' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* anchor: language */}
                  <div
                    id="language"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'language' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Language</span>
                        <button
                          onClick={() => handleCopyAnchorLink('language')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Interface language</p>
                    </div>

                    <select
                      value={settings.language}
                      onChange={(e) => onUpdateSettings({ language: e.target.value })}
                      className="bg-[#101215] border border-zinc-700 text-xs rounded px-2.5 py-1 text-white focus:outline-none"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Japanese (日本語)">Japanese (日本語)</option>
                      <option value="German (Deutsch)">German (Deutsch)</option>
                    </select>
                  </div>

                  {/* anchor: spell-check */}
                  <div
                    id="spell-check"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'spell-check' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Spell Check</span>
                        <button
                          onClick={() => handleCopyAnchorLink('spell-check')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Underline misspelled words in chat and prompt inputs</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.spellCheck}
                      onChange={(e) => onUpdateSettings({ spellCheck: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700 focus:ring-0"
                    />
                  </div>
                </div>

                {/* System Controls */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">System Controls</h4>

                  {/* anchor: microphone */}
                  <div
                    id="microphone"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'microphone' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Microphone</span>
                        <button
                          onClick={() => handleCopyAnchorLink('microphone')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Audio input device for voice mode</p>
                    </div>

                    <select
                      value={settings.microphone}
                      onChange={(e) => onUpdateSettings({ microphone: e.target.value })}
                      className="bg-[#101215] border border-zinc-700 text-xs rounded px-2.5 py-1 text-white focus:outline-none"
                    >
                      <option value="Default - HyperX SoloCast">Default - HyperX SoloCast</option>
                      <option value="Built-in Microphone">Built-in Microphone</option>
                      <option value="Virtual Audio Cable">Virtual Audio Cable</option>
                    </select>
                  </div>

                  {/* anchor: hardware-acceleration & hardware-acceleration-restart */}
                  <div
                    id="hardware-acceleration"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg space-y-2 transition-all ${
                      highlightedAnchor === 'hardware-acceleration' || highlightedAnchor === 'hardware-acceleration-restart'
                        ? 'anchor-highlight'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-200">Hardware Acceleration</span>
                          <button
                            onClick={() => handleCopyAnchorLink('hardware-acceleration')}
                            className="text-zinc-500 hover:text-blue-400"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-500">Utilize GPU for rendering computer viewport and animations</p>
                      </div>

                      <input
                        type="checkbox"
                        checked={settings.hardwareAcceleration}
                        onChange={(e) => onUpdateSettings({ hardwareAcceleration: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    <div id="hardware-acceleration-restart" className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">Requires app restart to apply changes</span>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Restart App
                      </button>
                    </div>
                  </div>

                  {/* anchor: network-debugger */}
                  <div
                    id="network-debugger"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'network-debugger' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Network Debugger</span>
                        <button
                          onClick={() => handleCopyAnchorLink('network-debugger')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Log all internal Hono API and sandbox network requests to devtools</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.networkDebugger}
                      onChange={(e) => onUpdateSettings({ networkDebugger: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  {/* anchor: notification-sound-enabled & notification-sound */}
                  <div
                    id="notification-sound-enabled"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg space-y-2 transition-all ${
                      highlightedAnchor === 'notification-sound-enabled' || highlightedAnchor === 'notification-sound'
                        ? 'anchor-highlight'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-200">Notification Sound</span>
                          <button
                            onClick={() => handleCopyAnchorLink('notification-sound-enabled')}
                            className="text-zinc-500 hover:text-blue-400"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-500">Play an audible chime when an agent finishes an autonomous task</p>
                      </div>

                      <input
                        type="checkbox"
                        checked={settings.notificationSoundEnabled}
                        onChange={(e) => onUpdateSettings({ notificationSoundEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    {settings.notificationSoundEnabled && (
                      <div id="notification-sound" className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">Sound chime style</span>
                        <select
                          value={settings.notificationSound}
                          onChange={(e) => onUpdateSettings({ notificationSound: e.target.value })}
                          className="bg-[#101215] border border-zinc-700 text-xs rounded px-2.5 py-1 text-white focus:outline-none"
                        >
                          <option value="Subtle Chime">Subtle Chime</option>
                          <option value="Modern Blip">Modern Blip</option>
                          <option value="Glass Ping">Glass Ping</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* anchor: timezone */}
                  <div
                    id="timezone"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'timezone' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Timezone</span>
                        <button
                          onClick={() => handleCopyAnchorLink('timezone')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Used for routine cron scheduling and timestamps</p>
                    </div>

                    <select
                      value={settings.timezone}
                      onChange={(e) => onUpdateSettings({ timezone: e.target.value })}
                      className="bg-[#101215] border border-zinc-700 text-xs rounded px-2.5 py-1 text-white focus:outline-none"
                    >
                      <option value="America/Los_Angeles (UTC-7)">America/Los_Angeles (UTC-7)</option>
                      <option value="America/New_York (UTC-4)">America/New_York (UTC-4)</option>
                      <option value="Europe/London (UTC+1)">Europe/London (UTC+1)</option>
                      <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>
                </div>

                {/* Agent Defaults & Execution */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Agent Defaults</h4>

                  {/* anchor: local-execution */}
                  <div
                    id="local-execution"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg flex items-center justify-between transition-all ${
                      highlightedAnchor === 'local-execution' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">Local Execution</span>
                        <button
                          onClick={() => handleCopyAnchorLink('local-execution')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Allow agents to run local bash commands on your host workstation</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={settings.localExecution}
                      onChange={(e) => onUpdateSettings({ localExecution: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  {/* anchor: auto-review & auto-review-rules */}
                  <div
                    id="auto-review"
                    className={`p-3 bg-[#171a1f] border border-zinc-800 rounded-lg space-y-2 transition-all ${
                      highlightedAnchor === 'auto-review' || highlightedAnchor === 'auto-review-rules'
                        ? 'anchor-highlight'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-200">Auto-Review</span>
                          <button
                            onClick={() => handleCopyAnchorLink('auto-review')}
                            className="text-zinc-500 hover:text-blue-400"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-500">Automatically inspect diffs before agent applies file writes</p>
                      </div>

                      <input
                        type="checkbox"
                        checked={settings.autoReview}
                        onChange={(e) => onUpdateSettings({ autoReview: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    {settings.autoReview && (
                      <div id="auto-review-rules" className="pt-2 border-t border-zinc-800/60">
                        <label className="text-[11px] text-zinc-500 block mb-1">Auto-Review Rules Prompt</label>
                        <input
                          type="text"
                          value={settings.autoReviewRules}
                          onChange={(e) => onUpdateSettings({ autoReviewRules: e.target.value })}
                          className="w-full bg-[#101215] border border-zinc-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* anchor: security-keys */}
                <div
                  id="security-keys"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl space-y-3 transition-all ${
                    highlightedAnchor === 'security-keys' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Security Keys & Passkeys</span>
                        <button
                          onClick={() => handleCopyAnchorLink('security-keys')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Hardware keys registered for signing computer box approvals</p>
                    </div>

                    <button
                      onClick={() => {
                        const newKey = {
                          id: `key_${Date.now()}`,
                          name: `Security Key #${settings.securityKeys.length + 1}`,
                          created: new Date().toISOString().split('T')[0],
                        };
                        onUpdateSettings({ securityKeys: [...settings.securityKeys, newKey] });
                      }}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded transition-colors"
                    >
                      + Add Key
                    </button>
                  </div>

                  <div className="space-y-2">
                    {settings.securityKeys.map((key) => (
                      <div key={key.id} className="p-2.5 bg-[#101215] border border-zinc-800/80 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                          <span className="font-medium text-zinc-200">{key.name}</span>
                        </div>
                        <span className="text-[11px] text-zinc-500">Added {key.created}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* COMPUTER TAB                                                              */}
            {/* ========================================================================= */}
            {activeTab === 'computer' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Computer Settings & Box Recovery</h3>
                  <p className="text-xs text-zinc-500">
                    Manage registered machines, cloud environments, and computer box recovery procedures.
                  </p>
                </div>

                {updateSuccessBanner && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{updateSuccessBanner}</span>
                  </div>
                )}

                {resetSuccessBanner && (
                  <div className="p-3 bg-amber-950/60 border border-amber-800 text-amber-300 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{resetSuccessBanner}</span>
                  </div>
                )}

                {/* anchor: computers */}
                <div
                  id="computers"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl space-y-3 transition-all ${
                    highlightedAnchor === 'computers' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Registered Machines</span>
                        <button
                          onClick={() => handleCopyAnchorLink('computers')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Host sandboxes assigned to agent execution</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {settings.computers.map((c) => (
                      <div key={c.id} className="p-3 bg-[#101215] border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <div className="font-medium text-zinc-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            {c.name}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                            {c.ip} • Status: {c.status}
                          </div>
                        </div>
                        <span className="text-[11px] text-zinc-500">Updated {c.updated}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Box Recovery Section */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Box Recovery</h4>

                  {/* anchor: update-computer */}
                  <div
                    id="update-computer"
                    className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl transition-all ${
                      highlightedAnchor === 'update-computer' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">Update Mokko's Computer</span>
                          <button
                            onClick={() => handleCopyAnchorLink('update-computer')}
                            className="text-zinc-500 hover:text-blue-400"
                            title="Copy mokko://app/v1/settings?id=update-computer link"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                          {copiedLink === 'update-computer' && (
                            <span className="text-[10px] text-emerald-400">Copied!</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-300">
                          Moves the box to a fresh instance keeping files and logins, but installed software must be reinstalled.
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Requires two-click confirmation to prevent accidental rebuilds.
                        </p>
                      </div>

                      <button
                        onClick={handleUpdateComputerClick}
                        disabled={isUpdatingComputer}
                        className={`px-4 py-2 rounded text-xs font-medium transition-all flex-shrink-0 shadow-sm ${
                          updateConfirmPending
                            ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {isUpdatingComputer
                          ? 'Updating Box...'
                          : updateConfirmPending
                          ? 'Click Again to Confirm'
                          : 'Update'}
                      </button>
                    </div>
                  </div>

                  {/* anchor: reset-computer */}
                  <div
                    id="reset-computer"
                    className={`p-4 bg-red-950/20 border border-red-900/50 rounded-xl space-y-3 transition-all ${
                      highlightedAnchor === 'reset-computer' ? 'anchor-highlight' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-red-300">Reset Mokko's Computer</span>
                          <button
                            onClick={() => handleCopyAnchorLink('reset-computer')}
                            className="text-zinc-500 hover:text-red-400"
                            title="Copy mokko://app/v1/settings?id=reset-computer link"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-300">
                          Destructive recovery of last resort: restores from the last saved snapshot and can lose recent unsynced work.
                        </p>
                      </div>

                      <button
                        onClick={() => setResetConfirmOpen(true)}
                        disabled={isResettingComputer}
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors flex-shrink-0 shadow"
                      >
                        {isResettingComputer ? 'Resetting...' : 'Reset'}
                      </button>
                    </div>

                    {/* Guidance alert steering users to Update instead */}
                    <div className="p-2.5 bg-yellow-950/30 border border-yellow-800/60 rounded text-[11px] text-yellow-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span>
                        <strong>Recommendation:</strong> Use <em>Update Mokko's Computer</em> above instead. Reset is only for catastrophic failure where the environment cannot boot.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* USAGE & BILLING TAB (Appears only when enabled for current account)       */}
            {/* ========================================================================= */}
            {activeTab === 'usage-billing' && settings.usageBillingEnabled && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Usage & Billing</h3>
                  <p className="text-xs text-zinc-500">
                    Included sandbox hours, on-demand compute credits, and plan subscription controls.
                  </p>
                </div>

                {/* anchor: usage */}
                <div
                  id="usage"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl space-y-4 transition-all ${
                    highlightedAnchor === 'usage' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Compute Usage</span>
                      <button
                        onClick={() => handleCopyAnchorLink('usage')}
                        className="text-zinc-500 hover:text-blue-400"
                      >
                        <Link2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {settings.usage.includedHoursUsed} / {settings.usage.includedHoursTotal} hrs used
                    </span>
                  </div>

                  {/* Meter bar */}
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (settings.usage.includedHoursUsed / settings.usage.includedHoursTotal) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* anchor: plan & cancel-trial */}
                <div
                  id="plan"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl space-y-3 transition-all ${
                    highlightedAnchor === 'plan' || highlightedAnchor === 'cancel-trial'
                      ? 'anchor-highlight'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Plan Controls</span>
                        <button
                          onClick={() => handleCopyAnchorLink('plan')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-sm font-medium text-blue-400 mt-1">{settings.usage.plan}</div>
                      <div className="text-[11px] text-zinc-500">Renews on {settings.usage.renewsAt}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="cancel-trial"
                        onClick={() => alert('Trial cancellation requested.')}
                        className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded border border-red-900/40 transition-colors"
                      >
                        Cancel Trial
                      </button>
                      <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors">
                        Change Plan
                      </button>
                    </div>
                  </div>
                </div>

                {/* anchor: on-demand */}
                <div
                  id="on-demand"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl flex items-center justify-between transition-all ${
                    highlightedAnchor === 'on-demand' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">On-Demand Credits</span>
                      <button
                        onClick={() => handleCopyAnchorLink('on-demand')}
                        className="text-zinc-500 hover:text-blue-400"
                      >
                        <Link2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-zinc-300 mt-0.5">
                      Current balance: <strong className="text-white">${settings.usage.onDemandCredits.toFixed(2)}</strong>
                    </div>
                    <p className="text-[11px] text-zinc-500">Automatically charges when included hours expire</p>
                  </div>

                  <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded transition-colors">
                    Add Funds
                  </button>
                </div>

                {/* anchor: billing */}
                <div
                  id="billing"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl flex items-center justify-between transition-all ${
                    highlightedAnchor === 'billing' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Billing Information</span>
                      <button
                        onClick={() => handleCopyAnchorLink('billing')}
                        className="text-zinc-500 hover:text-blue-400"
                      >
                        <Link2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">Card ending in •••• 4242 (Visa)</div>
                  </div>

                  <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded transition-colors">
                    Manage Invoices
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* UPDATES TAB                                                               */}
            {/* ========================================================================= */}
            {activeTab === 'updates' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Updates</h3>
                  <p className="text-xs text-zinc-500">
                    Application release tracks and desktop binary updater. Distinct from computer box updates.
                  </p>
                </div>

                {appUpdateMessage && (
                  <div className="p-3 bg-blue-950/60 border border-blue-800 text-blue-300 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>{appUpdateMessage}</span>
                  </div>
                )}

                {/* anchor: update-status */}
                <div
                  id="update-status"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl space-y-3 transition-all ${
                    highlightedAnchor === 'update-status' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Mokko App Version</span>
                        <button
                          onClick={() => handleCopyAnchorLink('update-status')}
                          className="text-zinc-500 hover:text-blue-400"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-sm font-mono text-zinc-200 mt-1">
                        {settings.updates.currentVersion} (electron-builder NSIS)
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Build targets: Windows x64, Windows ARM64, macOS, Linux
                      </p>
                    </div>

                    {/* "Check for Updates" Button: Updates the Mokko app itself, distinct from Update Mokko's Computer */}
                    <button
                      onClick={handleCheckForAppUpdates}
                      disabled={checkingAppUpdates}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors shadow flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${checkingAppUpdates ? 'animate-spin' : ''}`} />
                      <span>{checkingAppUpdates ? 'Checking...' : 'Check for Updates'}</span>
                    </button>
                  </div>
                </div>

                {/* anchor: update-channel */}
                <div
                  id="update-channel"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl flex items-center justify-between transition-all ${
                    highlightedAnchor === 'update-channel' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Update Track</span>
                      <button
                        onClick={() => handleCopyAnchorLink('update-channel')}
                        className="text-zinc-500 hover:text-blue-400"
                        title="Copy mokko://app/v1/settings?id=update-channel link"
                      >
                        <Link2 className="w-3 h-3" />
                      </button>
                      {copiedLink === 'update-channel' && (
                        <span className="text-[10px] text-emerald-400">Copied!</span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500">Choose between verified stable builds or nightly pre-releases</p>
                  </div>

                  <div className="flex items-center gap-1 bg-[#101215] p-1 rounded border border-zinc-800 text-xs">
                    {(['stable', 'nightly'] as const).map((track) => (
                      <button
                        key={track}
                        onClick={() =>
                          onUpdateSettings({
                            updates: { ...settings.updates, channel: track },
                          })
                        }
                        className={`px-3 py-1 rounded capitalize transition-colors ${
                          settings.updates.channel === track
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {track}
                      </button>
                    ))}
                  </div>
                </div>

                {/* anchor: automatic-updates */}
                <div
                  id="automatic-updates"
                  className={`p-4 bg-[#171a1f] border border-zinc-800 rounded-xl flex items-center justify-between transition-all ${
                    highlightedAnchor === 'automatic-updates' ? 'anchor-highlight' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Automatic Updates</span>
                      <button
                        onClick={() => handleCopyAnchorLink('automatic-updates')}
                        className="text-zinc-500 hover:text-blue-400"
                      >
                        <Link2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500">Download and apply app updates automatically in the background</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={settings.updates.automaticUpdates}
                    onChange={(e) =>
                      onUpdateSettings({
                        updates: { ...settings.updates, automaticUpdates: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700"
                  />
                </div>

                {/* Cross Links to Computer Recovery */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2 text-xs">
                  <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>Looking for Computer Environment Recovery?</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    "Check for Updates" updates the <strong>Mokko desktop app</strong>. To recreate or reset an agent's sandbox box, visit the Computer tab:
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab('computer');
                        setTimeout(() => {
                          const el = document.getElementById('update-computer');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 50);
                      }}
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      → Go to Update Mokko's Computer
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('computer');
                        setTimeout(() => {
                          const el = document.getElementById('reset-computer');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 50);
                      }}
                      className="text-red-400 hover:text-red-300 hover:underline"
                    >
                      → Go to Reset Mokko's Computer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Destructive Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181a1e] border border-red-900/60 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-white">Reset Mokko's Computer?</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              This is a <strong>destructive recovery of last resort</strong>. It restores the box from the last saved snapshot and can lose recent unsynced files and terminal session data.
            </p>
            <p className="text-[11px] text-yellow-300">
              We strongly recommend trying <strong>Update Mokko's Computer</strong> first, which preserves your files and logins.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetComputerConfirm}
                className="px-3 py-1.5 text-xs bg-red-700 hover:bg-red-600 text-white rounded font-medium transition-colors"
              >
                Yes, Reset Computer Box
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
