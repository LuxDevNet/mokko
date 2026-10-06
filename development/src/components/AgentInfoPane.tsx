import React, { useState } from 'react';
import { Agent, Routine, ChannelConnector } from '../types';
import {
  X,
  Settings as SettingsIcon,
  Monitor,
  Maximize2,
  Calendar,
  Radio,
  Users,
  Check,
  ChevronLeft,
  Bell,
  BellOff,
  Plus,
  ExternalLink
} from 'lucide-react';

interface AgentInfoPaneProps {
  agent: Agent;
  onClose: () => void;
  onUpdateAgent: (updated: Partial<Agent>) => void;
  onOpenFullScreenComputer: () => void;
}

export const AgentInfoPane: React.FC<AgentInfoPaneProps> = ({
  agent,
  onClose,
  onUpdateAgent,
  onOpenFullScreenComputer,
}) => {
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  // Edit subpage state
  const [editName, setEditName] = useState(agent.name);
  const [editTitle, setEditTitle] = useState(agent.title);
  const [editDesc, setEditDesc] = useState(agent.description);
  const [editAvatar, setEditAvatar] = useState(agent.avatar);
  const [editNotifications, setEditNotifications] = useState(agent.notificationsEnabled);

  // Sync state if agent changes
  React.useEffect(() => {
    setEditName(agent.name);
    setEditTitle(agent.title);
    setEditDesc(agent.description);
    setEditAvatar(agent.avatar);
    setEditNotifications(agent.notificationsEnabled);
  }, [agent]);

  const handleSaveSettings = () => {
    onUpdateAgent({
      name: editName,
      title: editTitle,
      description: editDesc,
      avatar: editAvatar,
      notificationsEnabled: editNotifications,
    });
    setIsEditingSettings(false);
  };

  const toggleRoutine = (routineId: string) => {
    const updated = agent.routines.map((r) =>
      r.id === routineId ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateAgent({ routines: updated });
  };

  const toggleChannel = (channelId: string) => {
    const updated = agent.channels.map((c) =>
      c.id === channelId ? { ...c, connected: !c.connected } : c
    );
    onUpdateAgent({ channels: updated });
  };

  return (
    <aside className="w-80 bg-[#121417] border-l border-[#22252a] flex flex-col h-[calc(100vh-2.5rem)] select-none">
      {/* Pane Header */}
      <div className="h-12 px-4 border-b border-[#22252a] flex items-center justify-between bg-[#15171b]">
        <div className="flex items-center gap-2 min-w-0">
          {isEditingSettings ? (
            <button
              onClick={() => setIsEditingSettings(false)}
              className="p-1 -ml-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
              title="Back to Agent Info"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : null}
          <h2 className="text-xs font-semibold text-zinc-200 truncate">
            {isEditingSettings ? 'Agent Settings' : agent.name}
          </h2>
        </div>

        {/* Header Controls: Gear beside the X */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className={`p-1.5 rounded transition-colors ${
              isEditingSettings
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2227]'
            }`}
            title="Per-Agent Settings"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#1f2227] rounded transition-colors"
            title="Close Info Pane (Cmd+Shift+I)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {isEditingSettings ? (
          /* Per-Agent Settings Subpage: avatar, name, title, description, and per-assistant notifications */
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1.5">
                Avatar URL
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={editAvatar}
                  alt="preview"
                  className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700"
                />
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="flex-1 bg-[#1a1c20] border border-zinc-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-[#1a1c20] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Title / Role
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-[#1a1c20] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-[#1a1c20] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-200">
                    Notifications
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Receive alert sound & badges for this agent
                  </div>
                </div>
                <button
                  onClick={() => setEditNotifications(!editNotifications)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    editNotifications ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      editNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditingSettings(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* Normal Info View */
          <>
            {/* Live Preview of Agent's Computer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  Computer Live Preview
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active
                </span>
              </div>

              {/* Clickable mini computer screen */}
              <div
                onClick={onOpenFullScreenComputer}
                className="group relative bg-[#090a0c] border border-zinc-700 hover:border-blue-500/80 rounded-lg p-2.5 cursor-pointer transition-all shadow-md overflow-hidden"
                title="Click to open full screen view"
              >
                {/* Mini desktop simulation */}
                <div className="bg-[#121417] rounded border border-zinc-800/80 p-2 font-mono text-[10px] text-zinc-400 h-28 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1">
                    <span className="text-zinc-500">{agent.computer.os}</span>
                    <span className="text-blue-400">{agent.computer.ip}</span>
                  </div>

                  <div className="space-y-1 text-zinc-400 text-[10px] select-none">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-500">➜</span>
                      <span className="text-zinc-300">workspace:</span>
                      <span className="text-zinc-500">git:(main)</span>
                    </div>
                    <div className="text-zinc-500 pl-3">
                      mokko-daemon running [PID 4192]
                    </div>
                    <div className="text-zinc-500 pl-3">
                      CPU: 14% | RAM: 6.2GB / 32GB
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[9px] text-zinc-600">
                    <span>Synced {agent.computer.lastSynced}</span>
                    <span className="text-blue-400/90 flex items-center gap-0.5 group-hover:underline">
                      <Maximize2 className="w-2.5 h-2.5" /> Fullscreen
                    </span>
                  </div>
                </div>

                {/* Overlay hover prompt */}
                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[1px]">
                  <span className="bg-black/80 text-white text-[10px] font-medium px-2 py-1 rounded shadow flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> Click to open full screen view
                  </span>
                </div>
              </div>
            </div>

            {/* Routines List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Routines
                </span>
                <span className="text-[10px] text-zinc-500">
                  {agent.routines.length} configured
                </span>
              </div>

              {agent.routines.length === 0 ? (
                <div className="bg-[#17191d] border border-zinc-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-zinc-500">No scheduled routines yet.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {agent.routines.map((routine) => (
                    <div
                      key={routine.id}
                      className="bg-[#17191d] border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-medium text-zinc-200 truncate">
                          {routine.name}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {routine.cron}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRoutine(routine.id)}
                        className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                          routine.enabled ? 'bg-purple-600' : 'bg-zinc-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform ${
                            routine.enabled ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Channels (connector available or connected) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  Channels
                </span>
                <span className="text-[10px] text-zinc-500">
                  {agent.channels.filter((c) => c.connected).length} active
                </span>
              </div>

              <div className="space-y-1.5">
                {agent.channels.map((chan) => (
                  <div
                    key={chan.id}
                    className="bg-[#17191d] border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-zinc-200 flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            chan.connected ? 'bg-cyan-400' : 'bg-zinc-600'
                          }`}
                        />
                        {chan.name}
                      </div>
                      <div className="text-[10px] text-zinc-500">{chan.type} Connector</div>
                    </div>

                    <button
                      onClick={() => toggleChannel(chan.id)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        chan.connected
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                      }`}
                    >
                      {chan.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Members in Group Chats */}
            {agent.isGroup && agent.members && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Members
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {agent.members.length} members
                  </span>
                </div>

                <div className="bg-[#17191d] border border-zinc-800 rounded-lg divide-y divide-zinc-800/80 text-xs">
                  {agent.members.map((member, idx) => (
                    <div key={idx} className="p-2 flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-200 font-bold">
                        {member[0]}
                      </div>
                      <span className="text-zinc-300 font-medium">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
