import React from 'react';

interface MokkoLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const MokkoLogo: React.FC<MokkoLogoProps> = ({
  className = '',
  size = 24,
  glow = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <radialGradient id="ml-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#141c2e" />
            <stop offset="70%" stopColor="#0a0c10" />
            <stop offset="100%" stopColor="#050608" />
          </radialGradient>
          <linearGradient id="ml-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
          <linearGradient id="ml-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="60%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          {glow && (
            <filter id="ml-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>

        {/* Squircle Tile */}
        <rect width="512" height="512" rx="112" fill="url(#ml-bg)" />
        <rect x="8" y="8" width="496" height="496" rx="104" stroke="#252d3d" strokeWidth="4" />

        {/* Ambient Grid */}
        <circle cx="256" cy="256" r="140" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 12" opacity="0.25" />

        {/* Outer Hex */}
        <path
          d="M148 168 L256 104 L364 168 L364 344 L256 408 L148 344 Z"
          fill="#0c1017"
          stroke="url(#ml-purple)"
          strokeWidth="12"
          strokeLinejoin="round"
        />

        {/* Neon Slash 1 */}
        <path
          d="M172 324 L316 148 L348 148 L204 324 Z"
          fill="url(#ml-cyan)"
          filter={glow ? "url(#ml-glow)" : undefined}
        />

        {/* Neon Slash 2 */}
        <path
          d="M228 356 L340 216 L356 216 L244 356 Z"
          fill="url(#ml-purple)"
          opacity="0.9"
        />

        {/* Center Quantum Pulse */}
        <circle cx="256" cy="256" r="16" fill="#ffffff" />
        <circle cx="256" cy="256" r="8" fill="#00f2fe" />
      </svg>
    </div>
  );
};
