import React from 'react';
import type { GameId } from '../types/arcade';

interface GameCoverArtProps {
  gameId: GameId;
  className?: string;
}

export const GameCoverArt: React.FC<GameCoverArtProps> = ({
  gameId,
  className = 'w-full h-44',
}) => {
  switch (gameId) {
    case 'spot-the-difference':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Spot the Difference Cover">
          <defs>
            <linearGradient id="cov-spot" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
          </defs>
          <rect width="400" height="220" fill="url(#cov-spot)" />
          {/* Left Frame */}
          <rect x="34" y="34" width="144" height="152" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="72" cy="70" r="14" fill="#FACC15" />
          <polygon points="56,162 106,96 156,162" fill="#22C55E" />
          <rect x="96" y="138" width="20" height="24" fill="#F97316" />
          {/* Right Frame */}
          <rect x="222" y="34" width="144" height="152" rx="14" fill="#1E293B" stroke="#EC4899" strokeWidth="3" />
          <circle cx="260" cy="70" r="14" fill="#EC4899" />
          <polygon points="244,162 294,96 344,162" fill="#22C55E" />
          <rect x="284" y="138" width="20" height="24" fill="#38BDF8" />
          {/* Highlight Ring on difference */}
          <circle cx="260" cy="70" r="24" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="6 4" />
          {/* Magnifying glass */}
          <circle cx="200" cy="115" r="34" fill="rgba(56, 189, 248, 0.2)" stroke="#FDE047" strokeWidth="6" />
          <line x1="224" y1="139" x2="252" y2="167" stroke="#FDE047" strokeWidth="9" strokeLinecap="round" />
        </svg>
      );

    case 'snake-classic':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Snake Classic Cover">
          <rect width="400" height="220" fill="#06281E" />
          <path
            d="M60 160 L150 160 L150 90 L260 90 L260 130"
            fill="none"
            stroke="#10B981"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="254" cy="126" r="4" fill="#06281E" />
          <circle cx="266" cy="126" r="4" fill="#06281E" />
          <circle cx="325" cy="130" r="16" fill="#F43F5E" stroke="#FEF08A" strokeWidth="3" />
        </svg>
      );

    case 'space-defender':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Space Defender Cover">
          <rect width="400" height="220" fill="#170F2E" />
          <circle cx="80" cy="50" r="2" fill="#FFF" />
          <circle cx="320" cy="40" r="3" fill="#FEF08A" />
          <circle cx="150" cy="35" r="2" fill="#38BDF8" />
          {/* Spaceship */}
          <polygon points="200,130 165,185 200,172 235,185" fill="#38BDF8" stroke="#A855F7" strokeWidth="3" />
          {/* Lasers */}
          <line x1="200" y1="75" x2="200" y2="115" stroke="#EC4899" strokeWidth="5" strokeLinecap="round" />
          {/* Enemy UFO */}
          <ellipse cx="200" cy="50" rx="38" ry="14" fill="#A855F7" stroke="#FACC15" strokeWidth="3" />
        </svg>
      );

    case '2048-challenge':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="2048 Challenge Cover">
          <rect width="400" height="220" fill="#271709" />
          <rect x="85" y="45" width="100" height="60" rx="12" fill="#F59E0B" />
          <text x="135" y="83" textAnchor="middle" fill="#FFF" fontSize="24" fontWeight="bold">512</text>
          <rect x="205" y="45" width="100" height="60" rx="12" fill="#EA580C" />
          <text x="255" y="83" textAnchor="middle" fill="#FFF" fontSize="24" fontWeight="bold">1024</text>
          <rect x="130" y="120" width="140" height="64" rx="14" fill="#FACC15" stroke="#FFF" strokeWidth="3" />
          <text x="200" y="161" textAnchor="middle" fill="#0F172A" fontSize="30" fontWeight="bold">2048</text>
        </svg>
      );

    case 'memory-match':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Memory Match Cover">
          <rect width="400" height="220" fill="#2A0B26" />
          <rect x="95" y="40" width="90" height="135" rx="14" fill="#EC4899" stroke="#FDE047" strokeWidth="3" transform="rotate(-8 140 107)" />
          <circle cx="140" cy="107" r="22" fill="#FDE047" />
          <rect x="215" y="40" width="90" height="135" rx="14" fill="#8B5CF6" stroke="#38BDF8" strokeWidth="3" transform="rotate(8 260 107)" />
          <circle cx="260" cy="107" r="22" fill="#38BDF8" />
        </svg>
      );

    case 'brick-breaker':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Brick Breaker Cover">
          <rect width="400" height="220" fill="#082032" />
          <rect x="70" y="35" width="75" height="24" rx="6" fill="#F43F5E" />
          <rect x="160" y="35" width="75" height="24" rx="6" fill="#FACC15" />
          <rect x="250" y="35" width="75" height="24" rx="6" fill="#22D3EE" />
          <rect x="115" y="70" width="75" height="24" rx="6" fill="#A855F7" />
          <rect x="205" y="70" width="75" height="24" rx="6" fill="#10B981" />
          <circle cx="200" cy="135" r="11" fill="#FFFFFF" />
          <rect x="140" y="175" width="120" height="16" rx="8" fill="#38BDF8" />
        </svg>
      );

    case 'whack-a-mole':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Whack-a-Mole Cover">
          <rect width="400" height="220" fill="#1F160A" />
          <ellipse cx="200" cy="168" rx="82" ry="22" fill="#451A03" stroke="#D97706" strokeWidth="3" />
          <path d="M155 165 L155 95 Q200 50 245 95 L245 165 Z" fill="#B45309" stroke="#FDE047" strokeWidth="3" />
          <circle cx="182" cy="105" r="6" fill="#0F172A" />
          <circle cx="218" cy="105" r="6" fill="#0F172A" />
          <ellipse cx="200" cy="122" rx="14" ry="9" fill="#F472B6" />
        </svg>
      );

    case 'bubble-shooter':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Bubble Shooter Cover">
          <rect width="400" height="220" fill="#1F0C2B" />
          <circle cx="150" cy="55" r="22" fill="#EC4899" />
          <circle cx="200" cy="55" r="22" fill="#38BDF8" />
          <circle cx="250" cy="55" r="22" fill="#FACC15" />
          <circle cx="175" cy="95" r="22" fill="#22C55E" />
          <circle cx="225" cy="95" r="22" fill="#EC4899" />
          <circle cx="200" cy="168" r="20" fill="#38BDF8" stroke="#FFF" strokeWidth="3" />
        </svg>
      );

    case 'maze-escape':
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Maze Escape Cover">
          <rect width="400" height="220" fill="#13112C" />
          <rect x="85" y="35" width="230" height="150" rx="10" fill="none" stroke="#A855F7" strokeWidth="6" />
          <line x1="145" y1="35" x2="145" y2="130" stroke="#38BDF8" strokeWidth="6" />
          <line x1="205" y1="85" x2="205" y2="185" stroke="#38BDF8" strokeWidth="6" />
          <line x1="255" y1="35" x2="255" y2="135" stroke="#38BDF8" strokeWidth="6" />
          <circle cx="115" cy="155" r="12" fill="#FACC15" />
          <circle cx="285" cy="65" r="12" fill="#10B981" />
        </svg>
      );

    case 'block-puzzle':
    default:
      return (
        <svg viewBox="0 0 400 220" className={className} role="img" aria-label="Block Puzzle Cover">
          <rect width="400" height="220" fill="#0B2126" />
          <rect x="115" y="55" width="48" height="48" rx="8" fill="#06B6D4" stroke="#FFF" strokeWidth="2" />
          <rect x="167" y="55" width="48" height="48" rx="8" fill="#06B6D4" stroke="#FFF" strokeWidth="2" />
          <rect x="167" y="107" width="48" height="48" rx="8" fill="#06B6D4" stroke="#FFF" strokeWidth="2" />
          <rect x="219" y="107" width="48" height="48" rx="8" fill="#EC4899" stroke="#FFF" strokeWidth="2" />
          <rect x="219" y="55" width="48" height="48" rx="8" fill="#FACC15" stroke="#FFF" strokeWidth="2" />
        </svg>
      );
  }
};
