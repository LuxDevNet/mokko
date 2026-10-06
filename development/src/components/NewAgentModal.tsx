import React, { useState } from 'react';
import { Agent } from '../types';
import { Plus, X, Users, Bot } from 'lucide-react';

interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agentData: Partial<Agent>) => Promise<void>;
  isCreating: boolean;
}

export const NewAgentModal: React.FC<NewAgentModalProps> = ({
  isOpen,
  onClose,
  onCreateAgent,
  isCreating,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [memberInput, setMemberInput] = useState('Alex Vance');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const members = isGroup
      ? memberInput.split(',').map((m) => m.trim()).filter(Boolean)
      : undefined;

    await onCreateAgent({
      name: name.trim(),
      title: title.trim() || (isGroup ? 'Group Agent Swarm' : 'Autonomous Specialist'),
      description: description.trim() || 'Custom created Mokko agent workspace.',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      isGroup,
      members,
    });

    setName('');
    setTitle('');
    setDescription('');
    setIsGroup(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#16181c] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Create New Agent</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Pipeline Assistant"
              className="w-full bg-[#101215] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">
              Role / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ETL & Analytics Specialist"
              className="w-full bg-[#101215] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the agent's responsibilities"
              className="w-full bg-[#101215] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="p-3 bg-[#101215] border border-zinc-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="font-medium text-zinc-200">Group Chat / Swarm</span>
              </div>
              <input
                type="checkbox"
                checked={isGroup}
                onChange={(e) => setIsGroup(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-zinc-800 border-zinc-700"
              />
            </div>

            {isGroup && (
              <div className="pt-2 border-t border-zinc-800">
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Members (comma separated)
                </label>
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Alex Vance, Mokko Assistant..."
                  className="w-full bg-[#171a1f] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded font-medium transition-colors shadow"
            >
              {isCreating ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
