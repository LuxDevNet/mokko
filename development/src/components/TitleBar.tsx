import React from 'react';
import { Minus, Square, X, Search, Terminal } from 'lucide-react';
import { MokkoLogo } from './MokkoLogo';

interface TitleBarProps {
  onOpenCommandPalette: () => void;
  onOpenDeepLinkDemo: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onOpenCommandPalette,
  onOpenDeepLinkDemo,
}) => {
  const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI;

  const handleMinimize = () => {
    (window as any).electronAPI?.minimize();
  };

  const handleMaximize = () => {
    (window as any).electronAPI?.maximize();
  };

  const handleClose = () => {
    (window as any).electronAPI?.close();
  };

  return (
    <header className="h-10 bg-[#0c0d0e] border-b border-[#22252a] flex items-center justify-between px-3 select-none titlebar-drag-region z-50">
      {/* Left: Branding & App Name */}
      <div className="flex items-center gap-2.5">
        <MokkoLogo size={22} glow={true} />
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs tracking-wider uppercase text-zinc-200">Mokko</span>
          <span className="text-[10px] bg-blue-950/60 border border-blue-800/40 text-blue-300 px-1.5 py-0.5 rounded-full font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Center: Command Palette Trigger & Quick Deep Link */}
      <div className="flex items-center gap-2 titlebar-no-drag">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1 bg-[#16181b] hover:bg-[#1f2227] text-zinc-400 hover:text-zinc-200 border border-[#2a2d33] rounded-md text-xs transition-colors"
          title="Open Command Palette (Cmd+K / Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search or jump to...</span>
          <kbd className="text-[10px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={onOpenDeepLinkDemo}
          className="flex items-center gap-1.5 px-2 py-1 bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-800/60 rounded-md text-[11px] transition-colors"
          title="Test mokko:// deep links"
        >
          <Terminal className="w-3 h-3 text-blue-400" />
          <span>Deep Links</span>
        </button>
      </div>

      {/* Right: Window controls */}
      <div className="flex items-center titlebar-no-drag">
        {isElectron ? (
          <div className="flex items-center">
            <button
              onClick={handleMinimize}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleMaximize}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded transition-colors"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Connected"></span>
            <span className="text-[11px] text-zinc-500 font-mono">READY</span>
          </div>
        )}
      </div>
    </header>
  );
};
