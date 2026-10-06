import React, { useState } from 'react';
import { Agent } from '../types';
import {
  X,
  Terminal,
  Activity,
  Cpu,
  HardDrive,
  RefreshCw,
  FolderTree,
  Send,
  Layers,
  ShieldAlert
} from 'lucide-react';

interface FullScreenComputerModalProps {
  agent: Agent;
  onClose: () => void;
  onNavigateToRecovery: () => void;
}

export const FullScreenComputerModal: React.FC<FullScreenComputerModalProps> = ({
  agent,
  onClose,
  onNavigateToRecovery,
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'processes' | 'filesystem'>('terminal');
  const [terminalInput, setTerminalInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    `[mokko-cloud-init] Connecting to sandbox ${agent.computer.ip}...`,
    `[mokko-cloud-init] Authenticated via mutual TLS. Machine: ${agent.computer.os}`,
    `[system] Host specs: ${agent.computer.cpu}, ${agent.computer.memory}`,
    `[agent-workspace] Mounted workspace volume: /home/mokko/project`,
    `[daemon] mokko-agent-daemon v2.4 initialized. Ready for commands.`,
  ]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    setLogs((prev) => [
      ...prev,
      `mokko@box:~/project$ ${cmd}`,
      cmd === 'clear'
        ? '[screen cleared]'
        : cmd === 'ls'
        ? 'README.md  package.json  src/  tsconfig.json  vite.config.ts'
        : cmd.startsWith('git')
        ? 'On branch main. Your branch is up to date with origin/main.'
        : `[executed in sandbox] ${cmd}: exit code 0`,
    ]);
    setTerminalInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-5xl h-[85vh] bg-[#0d0f12] border border-[#2b303a] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="h-12 bg-[#14171c] border-b border-[#252a33] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
                {agent.name}'s Computer
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
              {agent.computer.ip}
            </span>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              {agent.computer.os}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToRecovery}
              className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
              title="Box Recovery in Settings > Computer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Recovery Settings</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              title="Close (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* System telemetry bar */}
        <div className="bg-[#111317] border-b border-[#1f232b] px-4 py-2 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>CPU: <strong className="text-zinc-200">14%</strong> ({agent.computer.cpu})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>Memory: <strong className="text-zinc-200">6.2 GB</strong> / {agent.computer.memory}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Uptime: <strong className="text-zinc-200">18d 4h 12m</strong></span>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-1 bg-[#1a1d24] p-0.5 rounded border border-zinc-800 text-[11px]">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'terminal'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Terminal</span>
            </button>
            <button
              onClick={() => setActiveTab('processes')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'processes'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Processes</span>
            </button>
            <button
              onClick={() => setActiveTab('filesystem')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'filesystem'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FolderTree className="w-3 h-3" />
              <span>Files</span>
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 bg-[#090b0e] p-4 overflow-hidden flex flex-col">
          {activeTab === 'terminal' && (
            <div className="flex-1 flex flex-col font-mono text-xs">
              <div className="flex-1 overflow-y-auto space-y-1 text-zinc-300 pr-2">
                {logs.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line.startsWith('mokko@box') ? (
                      <span className="text-emerald-400 font-semibold">{line}</span>
                    ) : line.includes('[system]') || line.includes('[daemon]') ? (
                      <span className="text-blue-400">{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Terminal command input */}
              <form onSubmit={handleRunCommand} className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs">mokko@box:~/project$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type a bash command (e.g. ls, git status, npm test)..."
                  className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-zinc-600"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1 font-sans"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'processes' && (
            <div className="flex-1 overflow-y-auto text-xs font-mono">
              <table className="w-full text-left text-zinc-300 border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[11px]">
                    <th className="py-2">PID</th>
                    <th className="py-2">USER</th>
                    <th className="py-2">CPU%</th>
                    <th className="py-2">MEM%</th>
                    <th className="py-2">COMMAND</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  <tr>
                    <td className="py-2 text-zinc-500">1</td>
                    <td>root</td>
                    <td>0.0</td>
                    <td>0.1</td>
                    <td>/sbin/init</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-500">4192</td>
                    <td>mokko</td>
                    <td>3.4</td>
                    <td>2.1</td>
                    <td>mokko-agent-daemon --port 31415</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-500">5081</td>
                    <td>mokko</td>
                    <td>8.2</td>
                    <td>4.8</td>
                    <td>node /usr/local/bin/vite dev</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-500">7312</td>
                    <td>mokko</td>
                    <td>0.1</td>
                    <td>0.3</td>
                    <td>bash -i</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'filesystem' && (
            <div className="flex-1 overflow-y-auto text-xs text-zinc-300 space-y-2">
              <div className="text-[11px] text-zinc-500 pb-2 border-b border-zinc-800">
                Workspace directory: <code className="text-zinc-300">/home/mokko/project</code>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {['src/', 'public/', 'electron/', 'package.json', 'tsconfig.json', 'vite.config.ts', 'README.md'].map(
                  (item, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg hover:border-blue-500 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <FolderTree className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono text-xs truncate">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
