import React, { useState } from 'react';
import { X, ExternalLink, Terminal, Check, AlertCircle } from 'lucide-react';

interface DeepLinkDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAnchor: (anchorId: string) => void;
}

export const DeepLinkDemoModal: React.FC<DeepLinkDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateAnchor,
}) => {
  const [customUrl, setCustomUrl] = useState('mokko://app/v1/settings?id=update-computer');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const validAnchors = [
    { anchor: 'theme', label: 'Theme (Follow System / Light / Dark)', tab: 'General' },
    { anchor: 'language', label: 'Language', tab: 'General' },
    { anchor: 'update-computer', label: "Update Mokko's Computer (2-click confirm)", tab: 'Computer / Updates' },
    { anchor: 'reset-computer', label: "Reset Mokko's Computer (Destructive)", tab: 'Computer / Updates' },
    { anchor: 'update-channel', label: 'Update Track (Stable / Nightly)', tab: 'Updates' },
    { anchor: 'security-keys', label: 'Security Keys & Passkeys', tab: 'General' },
    { anchor: 'usage', label: 'Usage & Compute Meters', tab: 'Usage & Billing' },
    { anchor: 'account', label: 'Account Profile', tab: 'General' },
    { anchor: 'hardware-acceleration', label: 'Hardware Acceleration', tab: 'General' },
    { anchor: 'auto-review', label: 'Auto-Review Rules', tab: 'General' },
  ];

  const handleLaunchUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const anchorId = parsed.searchParams.get('id');
      if (anchorId) {
        onNavigateAnchor(anchorId);
        onClose();
      } else {
        setFeedback('URL parsed, but no "id" query parameter found.');
      }
    } catch {
      setFeedback('Invalid URL scheme. Must be mokko://app/v1/settings?id=<row> or grokbot://app/v1/settings?id=<row>');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-[#14161a] border border-blue-900/50 rounded-xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Mokko Deep Links (mokko://)</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Click any verified canonical link below or type a custom deep-link URL. The app will navigate directly to that settings row and trigger a pulsing highlight.
        </p>

        {/* Custom URL Tester */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-400 block">Custom mokko:// URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-[#101215] border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleLaunchUrl(customUrl)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-medium transition-colors"
            >
              Launch
            </button>
          </div>
          {feedback && <div className="text-[11px] text-amber-400 mt-1">{feedback}</div>}
        </div>

        {/* Preset Real Paths */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Canonical Interface Paths
          </span>
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {validAnchors.map((item) => (
              <button
                key={item.anchor}
                onClick={() => handleLaunchUrl(`mokko://app/v1/settings?id=${item.anchor}`)}
                className="w-full p-2 bg-[#191c22] hover:bg-[#20242b] border border-zinc-800 rounded flex items-center justify-between text-left text-xs transition-colors group"
              >
                <div>
                  <div className="font-medium text-zinc-200 group-hover:text-blue-400">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    mokko://app/v1/settings?id={item.anchor}
                  </div>
                </div>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                  {item.tab}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
