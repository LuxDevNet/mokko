import React, { useState, useEffect, useRef } from 'react';
import { Agent, AppSettings } from '../types';
import { Plus, Trash2, Users, Bot, Circle } from 'lucide-react';

interface SidebarProps {
  agents: Agent[];
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
  onRequestDeleteAgent: (agent: Agent) => void;
  onOpenNewAgentModal: () => void;
  onOpenSettings: (anchorId?: string) => void;
  settings: AppSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  agents,
  activeAgentId,
  onSelectAgent,
  onRequestDeleteAgent,
  onOpenNewAgentModal,
  onOpenSettings,
  settings,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    agent: Agent;
  } | null>(null);

  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, agent: Agent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      agent,
    });
  };

  return (
    <aside className="w-64 bg-[#111315] border-r border-[#22252a] flex flex-col justify-between h-[calc(100vh-2.5rem)] relative select-none">
      {/* Top Header & Agent List */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Workspace Agents Header */}
        <div className="px-3 py-3 border-b border-[#1f2227] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Agents
            </span>
            <span className="text-[11px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">
              {agents.length}
            </span>
          </div>

          <button
            onClick={onOpenNewAgentModal}
            className="p-1 hover:bg-[#1f2227] text-zinc-400 hover:text-zinc-100 rounded transition-colors"
            title="Create New Agent"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Agents Scrollable List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {agents.map((agent) => {
            const isActive = agent.id === activeAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                onContextMenu={(e) => handleContextMenu(e, agent)}
                className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-[#1b1f24] border-blue-500/40 text-white shadow-sm'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#16181b]'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-7 h-7 rounded-md bg-zinc-800 object-cover border border-[#2a2e34]"
                  />
                  <Circle
                    className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 rounded-full fill-current ${
                      agent.computer.status === 'running'
                        ? 'text-amber-400'
                        : 'text-emerald-500'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate block">
                      {agent.name}
                    </span>
                    {agent.isGroup && (
                      <Users className="w-3 h-3 text-zinc-500 flex-shrink-0 ml-1" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">
                    {agent.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Account Button (Opening settings: avatar + account name, NO GEAR ICON) */}
      <div className="p-2 border-t border-[#1f2227] bg-[#0d0f11]">
        <button
          onClick={() => onOpenSettings('account')}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#1a1c20] text-zinc-300 hover:text-white transition-all text-left group"
          title="Account & Settings (Cmd+,)"
        >
          <img
            src={settings.account.avatar}
            alt={settings.account.name}
            className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 object-cover group-hover:border-blue-500 transition-colors"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
              {settings.account.name}
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 truncate">
              <span>{settings.account.provider} connected</span>
            </div>
          </div>
          <kbd className="hidden group-hover:inline-block text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded font-mono">
            ⌘,
          </kbd>
        </button>
      </div>

      {/* Custom Context Menu on Right Click */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{
            top: `${Math.min(contextMenu.y, window.innerHeight - 80)}px`,
            left: `${Math.min(contextMenu.x, 260)}px`,
          }}
          className="fixed z-50 bg-[#1c1f24] border border-[#2e333b] shadow-2xl rounded-lg py-1 w-44 text-xs animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 border-b border-zinc-800 text-[10px] text-zinc-400 font-medium truncate">
            {contextMenu.agent.name}
          </div>
          <button
            onClick={() => {
              onRequestDeleteAgent(contextMenu.agent);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </aside>
  );
};
