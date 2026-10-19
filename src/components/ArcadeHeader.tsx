import React from 'react';
import {
  Gamepad2,
  Home,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { AppPage } from '../types/arcade';
import { soundService } from '../services/soundService';

interface ArcadeHeaderProps {
  activePage: AppPage;
  soundEnabled: boolean;
  onNavigate: (page: AppPage) => void;
  onToggleSound: () => void;
}

export const ArcadeHeader: React.FC<ArcadeHeaderProps> = ({
  activePage,
  soundEnabled,
  onNavigate,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080B1A]/90 backdrop-blur-md border-b border-indigo-500/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <button
          type="button"
          data-testid="header-logo-btn"
          onClick={() => {
            soundService.playClick();
            onNavigate('home');
          }}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 p-0.5 shadow-neon-purple group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#0B0F26] rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="font-display font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              BreakTime Arcade
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-cyan-400">
              พักแป๊บ เกมเพลิน
            </div>
          </div>
        </button>

        {/* Navigation Links & Sound Toggle */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5" aria-label="Main Navigation">
          <button
            type="button"
            data-testid="nav-home-btn"
            onClick={() => {
              soundService.playClick();
              onNavigate('home');
            }}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-display font-semibold text-xs sm:text-sm transition ${
              activePage === 'home'
                ? 'bg-purple-600/90 text-white shadow-neon-purple'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            type="button"
            data-testid="nav-scores-btn"
            onClick={() => {
              soundService.playClick();
              onNavigate('scores');
            }}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-display font-semibold text-xs sm:text-sm transition ${
              activePage === 'scores'
                ? 'bg-purple-600/90 text-white shadow-neon-purple'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>My Scores</span>
          </button>

          <button
            type="button"
            data-testid="nav-settings-btn"
            onClick={() => {
              soundService.playClick();
              onNavigate('settings');
            }}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-display font-semibold text-xs sm:text-sm transition ${
              activePage === 'settings'
                ? 'bg-purple-600/90 text-white shadow-neon-purple'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            type="button"
            data-testid="header-sound-toggle"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
            title={soundEnabled ? 'เสียง: เปิดอยู่ (คลิกเพื่อปิด)' : 'เสียง: ปิดอยู่ (คลิกเพื่อเปิด)'}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium transition ${
              soundEnabled
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-neon-cyan'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-300" />
                <span className="hidden md:inline">เปิดเสียง</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">ปิดเสียง</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
