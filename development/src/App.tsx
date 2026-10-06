import React, { useState, useEffect } from 'react';
import { Agent, AppSettings } from './types';
import { api } from './services/api';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { AgentInfoPane } from './components/AgentInfoPane';
import { FullScreenComputerModal } from './components/FullScreenComputerModal';
import { SettingsModal } from './components/SettingsModal';
import { CommandPalette } from './components/CommandPalette';
import { DeleteAgentModal } from './components/DeleteAgentModal';
import { NewAgentModal } from './components/NewAgentModal';
import { DeepLinkDemoModal } from './components/DeepLinkDemoModal';

export const App: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string>('agent-primary');
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // UI Modals & Panes State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsAnchorId, setSettingsAnchorId] = useState<string | undefined>(undefined);
  const [isAgentInfoOpen, setIsAgentInfoOpen] = useState(true);
  const [isFullScreenComputerOpen, setIsFullScreenComputerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewAgentOpen, setIsNewAgentOpen] = useState(false);
  const [isDeepLinkDemoOpen, setIsDeepLinkDemoOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isDeletingAgent, setIsDeletingAgent] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [fetchedAgents, fetchedSettings] = await Promise.all([
        api.getAgents(),
        api.getSettings(),
      ]);
      setAgents(fetchedAgents);
      setSettings(fetchedSettings);
      if (fetchedAgents.length > 0) {
        setActiveAgentId(fetchedAgents[0].id);
      }
    }
    loadData();
  }, []);

  // Listen for Electron deep links (mokko://...) and toggle IPC
  useEffect(() => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI?.onNavigateAnchor) {
      const unsubscribe = electronAPI.onNavigateAnchor((anchorId: string) => {
        handleOpenSettings(anchorId);
      });
      return unsubscribe;
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Cmd+, or Ctrl+, -> Open Settings (no gear icon!)
      if (isCmdOrCtrl && e.key === ',') {
        e.preventDefault();
        handleOpenSettings();
      }

      // Cmd+Shift+I or Ctrl+Shift+I -> Toggle Agent Info Pane
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setIsAgentInfoOpen((prev) => !prev);
      }

      // Cmd+K or Ctrl+K -> Command Palette
      if (isCmdOrCtrl && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }

      // Escape -> close overlays
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        else if (isFullScreenComputerOpen) setIsFullScreenComputerOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else if (isDeepLinkDemoOpen) setIsDeepLinkDemoOpen(false);
        else if (agentToDelete) setAgentToDelete(null);
        else if (isNewAgentOpen) setIsNewAgentOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isFullScreenComputerOpen,
    isSettingsOpen,
    isDeepLinkDemoOpen,
    agentToDelete,
    isNewAgentOpen,
  ]);

  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  const handleOpenSettings = (anchorId?: string) => {
    setSettingsAnchorId(anchorId);
    setIsSettingsOpen(true);
  };

  const handleUpdateSettings = async (patch: Partial<AppSettings>) => {
    if (!settings) return;
    try {
      const updated = await api.updateSettings(patch);
      setSettings(updated);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeAgent) return;
    setIsSendingMessage(true);
    try {
      const { userMessage, replyMessage } = await api.sendMessage(activeAgent.id, content);
      setAgents((prev) =>
        prev.map((a) =>
          a.id === activeAgent.id
            ? { ...a, transcript: [...a.transcript, userMessage, replyMessage] }
            : a
        )
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleUpdateAgent = async (patch: Partial<Agent>) => {
    if (!activeAgent) return;
    try {
      const updated = await api.updateAgent(activeAgent.id, patch);
      setAgents((prev) => prev.map((a) => (a.id === activeAgent.id ? updated : a)));
    } catch (err) {
      console.error('Failed to update agent:', err);
    }
  };

  const handleConfirmDeleteAgent = async (agentId: string) => {
    setIsDeletingAgent(true);
    try {
      await api.deleteAgent(agentId);
      const remaining = agents.filter((a) => a.id !== agentId);
      setAgents(remaining);
      if (remaining.length > 0) {
        setActiveAgentId(remaining[0].id);
      }
      setAgentToDelete(null);
    } finally {
      setIsDeletingAgent(false);
    }
  };

  const handleCreateAgent = async (agentData: Partial<Agent>) => {
    setIsCreatingAgent(true);
    try {
      const created = await api.createAgent(agentData);
      setAgents((prev) => [...prev, created]);
      setActiveAgentId(created.id);
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleTriggerUpdateComputer = async () => {
    await api.updateComputer();
  };

  const handleTriggerResetComputer = async () => {
    await api.resetComputer();
  };

  if (!settings) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0c0d0e] text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Initializing Mokko environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-[#0c0d0e] ${settings.theme === 'light' ? 'light-mode' : ''}`}>
      {/* TitleBar with Windows/Mac controls & Command Palette trigger */}
      <TitleBar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenDeepLinkDemo={() => setIsDeepLinkDemoOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          agents={agents}
          activeAgentId={activeAgentId}
          onSelectAgent={setActiveAgentId}
          onRequestDeleteAgent={(agent) => setAgentToDelete(agent)}
          onOpenNewAgentModal={() => setIsNewAgentOpen(true)}
          onOpenSettings={handleOpenSettings}
          settings={settings}
        />

        {/* Center Chat View */}
        {activeAgent ? (
          <ChatView
            agent={activeAgent}
            onSendMessage={handleSendMessage}
            onOpenAgentInfo={() => setIsAgentInfoOpen(!isAgentInfoOpen)}
            onOpenFullScreenComputer={() => setIsFullScreenComputerOpen(true)}
            isSending={isSendingMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
            No agents found. Create one from the sidebar.
          </div>
        )}

        {/* Right Per-Agent Info Pane */}
        {activeAgent && isAgentInfoOpen && (
          <AgentInfoPane
            agent={activeAgent}
            onClose={() => setIsAgentInfoOpen(false)}
            onUpdateAgent={handleUpdateAgent}
            onOpenFullScreenComputer={() => setIsFullScreenComputerOpen(true)}
          />
        )}
      </div>

      {/* Full Screen Computer Sandbox Modal */}
      {activeAgent && isFullScreenComputerOpen && (
        <FullScreenComputerModal
          agent={activeAgent}
          onClose={() => setIsFullScreenComputerOpen(false)}
          onNavigateToRecovery={() => {
            setIsFullScreenComputerOpen(false);
            handleOpenSettings('update-computer');
          }}
        />
      )}

      {/* Global Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
        initialAnchorId={settingsAnchorId}
        onTriggerUpdateComputer={handleTriggerUpdateComputer}
        onTriggerResetComputer={handleTriggerResetComputer}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        agents={agents}
        onSelectAgent={setActiveAgentId}
        onOpenSettings={handleOpenSettings}
        onOpenNewAgent={() => setIsNewAgentOpen(true)}
        onToggleAgentInfo={() => setIsAgentInfoOpen(!isAgentInfoOpen)}
        onOpenFullScreenComputer={() => setIsFullScreenComputerOpen(true)}
      />

      {/* Delete Agent Modal */}
      <DeleteAgentModal
        agent={agentToDelete}
        onClose={() => setAgentToDelete(null)}
        onConfirmDelete={handleConfirmDeleteAgent}
        isDeleting={isDeletingAgent}
      />

      {/* New Agent Modal */}
      <NewAgentModal
        isOpen={isNewAgentOpen}
        onClose={() => setIsNewAgentOpen(false)}
        onCreateAgent={handleCreateAgent}
        isCreating={isCreatingAgent}
      />

      {/* Deep Link Demonstration Modal */}
      <DeepLinkDemoModal
        isOpen={isDeepLinkDemoOpen}
        onClose={() => setIsDeepLinkDemoOpen(false)}
        onNavigateAnchor={handleOpenSettings}
      />
    </div>
  );
};
