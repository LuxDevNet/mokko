import React from 'react';
import { Agent } from '../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteAgentModalProps {
  agent: Agent | null;
  onClose: () => void;
  onConfirmDelete: (agentId: string) => Promise<void>;
  isDeleting: boolean;
}

export const DeleteAgentModal: React.FC<DeleteAgentModalProps> = ({
  agent,
  onClose,
  onConfirmDelete,
  isDeleting,
}) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#16181c] border border-red-900/60 rounded-xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Delete Agent</h3>
              <p className="text-[11px] text-zinc-400">Permanent action</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-zinc-300">
          <p>
            Are you sure you want to delete <strong className="text-white">{agent.name}</strong>?
          </p>
          <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-red-200 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>
              This is a permanent delete that removes the agent and its entire transcript history. There is no archive or hide.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmDelete(agent.id)}
            disabled={isDeleting}
            className="px-4 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors shadow"
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};
