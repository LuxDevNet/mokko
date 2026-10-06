import React, { useState, useEffect, useRef } from 'react';
import { Agent } from '../types';
import {
  Search,
  Sliders,
  Monitor,
  RefreshCw,
  Plus,
  Bot,
  Info,
  Laptop,
  Palette,
  Terminal,
  ShieldAlert
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  onSelectAgent: (id: string) => void;
  onOpenSettings: (anchorId?: string) => void;
  onOpenNewAgent: () => void;
  onToggleAgentInfo: () => void;
  onOpenFullScreenComputer: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  agents,
  onSelectAgent,
  onOpenSettings,
  onOpenNewAgent,
  onToggleAgentInfo,
  onOpenFullScreenComputer,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const items = [
    {
      id: 'open-settings',
      title: 'Open settings',
      subtitle: 'Open global application preferences',
      icon: <Sliders className="w-4 h-4 text-blue-400" />,
      action: () => onOpenSettings(),
    },
    {
      id: 'settings-theme',
      title: 'Open settings: Theme',
      subtitle: 'mokko://app/v1/settings?id=theme',
      icon: <Palette className="w-4 h-4 text-indigo-400" />,
      action: () => onOpenSettings('theme'),
    },
    {
      id: 'settings-update-comp',
      title: "Open settings: Update Mokko's Computer",
      subtitle: 'mokko://app/v1/settings?id=update-computer',
      icon: <RefreshCw className="w-4 h-4 text-cyan-400" />,
      action: () => onOpenSettings('update-computer'),
    },
    {
      id: 'settings-reset-comp',
      title: "Open settings: Reset Mokko's Computer",
      subtitle: 'mokko://app/v1/settings?id=reset-computer',
      icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
      action: () => onOpenSettings('reset-computer'),
    },
    {
      id: 'settings-updates',
      title: 'Open settings: Updates (Check for Updates)',
      subtitle: 'mokko://app/v1/settings?id=update-status',
      icon: <RefreshCw className="w-4 h-4 text-purple-400" />,
      action: () => onOpenSettings('update-status'),
    },
    {
      id: 'toggle-info',
      title: 'Toggle Agent Info Pane',
      subtitle: 'Inspect live computer, routines, and channels (Cmd+Shift+I)',
      icon: <Info className="w-4 h-4 text-emerald-400" />,
      action: () => onToggleAgentInfo(),
    },
    {
      id: 'full-computer',
      title: 'Open Full Screen Computer',
      subtitle: 'Launch full terminal & filesystem sandbox inspection',
      icon: <Monitor className="w-4 h-4 text-amber-400" />,
      action: () => onOpenFullScreenComputer(),
    },
    {
      id: 'new-agent',
      title: 'Create New Agent',
      subtitle: 'Spawn a new autonomous worker or group swarm',
      icon: <Plus className="w-4 h-4 text-green-400" />,
      action: () => onOpenNewAgent(),
    },
    ...agents.map((a) => ({
      id: `switch-${a.id}`,
      title: `Switch Agent: ${a.name}`,
      subtitle: a.title,
      icon: <Bot className="w-4 h-4 text-zinc-400" />,
      action: () => onSelectAgent(a.id),
    })),
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#14161a] border border-[#2c313a] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#22262d] bg-[#181a20]">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or jump to settings anchor..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono border border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">No matching commands found.</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  idx === selectedIndex
                    ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                    : 'hover:bg-[#1a1d22] text-zinc-300 border border-transparent'
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{item.title}</div>
                  <div className="text-[11px] text-zinc-500 truncate">{item.subtitle}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
