import React, { useState, useRef, useEffect } from 'react';
import { Agent, ChatMessage } from '../types';
import {
  Send,
  Terminal,
  Monitor,
  Info,
  Maximize2,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Paperclip
} from 'lucide-react';

interface ChatViewProps {
  agent: Agent;
  onSendMessage: (content: string) => Promise<void>;
  onOpenAgentInfo: () => void;
  onOpenFullScreenComputer: () => void;
  isSending: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  agent,
  onSendMessage,
  onOpenAgentInfo,
  onOpenFullScreenComputer,
  isSending,
}) => {
  const [input, setInput] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agent.transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const msg = input.trim();
    setInput('');
    await onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-2.5rem)] bg-[#0e1012] select-none">
      {/* Chat Header */}
      <header className="h-12 px-4 border-b border-[#22252a] bg-[#121417] flex items-center justify-between">
        {/* Agent Name Button (Clicking name opens per-agent info pane!) */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenAgentInfo}
            className="flex items-center gap-2.5 text-left group p-1 -ml-1 rounded-lg hover:bg-zinc-800/60 transition-colors"
            title="Click agent name to open Info Pane (Cmd+Shift+I)"
          >
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 object-cover"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border border-zinc-900" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-100 group-hover:text-blue-400 transition-colors truncate">
                  {agent.name}
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono group-hover:border-zinc-600 border border-transparent">
                  Cmd+Shift+I
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 truncate block">
                {agent.title}
              </span>
            </div>
          </button>
        </div>

        {/* Right Header: Computer Status Indicator & Full Screen Computer View */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFullScreenComputer}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1d22] hover:bg-[#23272e] border border-zinc-700/80 rounded-md text-xs text-zinc-300 hover:text-white transition-colors"
            title="Open Live Full Screen Computer"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Computer:</span>
            <span className="text-emerald-400 font-mono text-[11px]">{agent.computer.ip}</span>
            <Maximize2 className="w-3 h-3 text-zinc-500 ml-1" />
          </button>

          <button
            onClick={onOpenAgentInfo}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
            title="Toggle Agent Info Pane"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Transcript Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {agent.transcript.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
            }`}
          >
            {msg.role !== 'user' && (
              <div className="w-7 h-7 rounded-md bg-[#191c22] border border-zinc-700/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                {msg.role === 'system' ? (
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                )}
              </div>
            )}

            <div
              className={`space-y-1.5 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed select-text ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : msg.role === 'system'
                    ? 'bg-[#15171b] border border-zinc-800 text-zinc-400 italic'
                    : 'bg-[#181a1f] border border-[#2a2e35] text-zinc-200 shadow-sm'
                }`}
              >
                {msg.content}

                {/* Tool call display card (e.g. computer execution) */}
                {msg.toolCall && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-700/60 font-mono text-[11px] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <Terminal className="w-3 h-3" />
                      <span>{msg.toolCall.name}</span>
                    </div>
                    <div className="bg-[#0f1114] p-2 rounded border border-zinc-800 text-zinc-300">
                      <code>{JSON.stringify(msg.toolCall.args, null, 2)}</code>
                    </div>
                    {msg.toolCall.output && (
                      <div className="bg-[#0c0d10] p-2 rounded border border-emerald-900/40 text-emerald-300 whitespace-pre-wrap">
                        {msg.toolCall.output}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`text-[10px] text-zinc-500 px-1 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-md bg-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex gap-3 max-w-3xl mr-auto justify-start items-center">
            <div className="w-7 h-7 rounded-md bg-[#191c22] border border-zinc-700/80 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            </div>
            <div className="bg-[#181a1f] border border-[#2a2e35] rounded-xl px-4 py-2.5 text-xs text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Mokko is thinking and running commands...</span>
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#22252a] bg-[#121417]">
        <form
          onSubmit={handleSubmit}
          className="bg-[#181a1f] border border-zinc-700/80 focus-within:border-blue-500/80 rounded-xl p-2 transition-all shadow-md"
        >
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.name}... (Press Enter to send, Shift+Enter for new line)`}
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none px-2 select-text"
          />

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Mokko Autonomous Agent (Full Workspace & Computer Box)</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
