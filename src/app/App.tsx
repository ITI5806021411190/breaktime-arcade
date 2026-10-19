import React, { useState, useCallback, Suspense } from 'react';
import type { AppPage, GameId, UserSettings } from '../types/arcade';
import {
  loadStorageData,
  resetAllProgress,
  updateSettings,
} from '../storage/storageService';
import { getGameById } from '../games/registry/gameRegistry';
import { ArcadeHeader } from '../components/ArcadeHeader';
import { ArcadeHome } from '../components/ArcadeHome';
import { MyScoresPage } from '../components/MyScoresPage';
import { SettingsPage } from '../components/SettingsPage';
import { soundService } from '../services/soundService';

export const App: React.FC = () => {
  const [storageData, setStorageData] = useState(() => loadStorageData());
  const [activePage, setActivePage] = useState<AppPage>('home');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);

  const refreshStorage = useCallback(() => {
    setStorageData(loadStorageData());
  }, []);

  const handleNavigate = (page: AppPage) => {
    refreshStorage();
    setActivePage(page);
    if (page !== 'play') {
      setActiveGameId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayGame = (gameId: GameId) => {
    const meta = getGameById(gameId);
    if (!meta || meta.status !== 'playable') return;
    setActiveGameId(gameId);
    setActivePage('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const nextSound = !storageData.settings.soundEnabled;
    const updated = updateSettings({ soundEnabled: nextSound });
    setStorageData(updated);
    if (nextSound) {
      setTimeout(() => soundService.playClick(), 30);
    }
  };

  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    const updated = updateSettings(partial);
    setStorageData(updated);
  };

  const handleResetProgress = () => {
    const updated = resetAllProgress();
    setStorageData(updated);
  };

  const activeGameMeta = activeGameId ? getGameById(activeGameId) : undefined;
  const LazyGameComponent = activeGameMeta?.lazyComponent;

  return (
    <div className="min-h-screen flex flex-col bg-[#080B1A] text-slate-100">
      <ArcadeHeader
        activePage={activePage}
        soundEnabled={storageData.settings.soundEnabled}
        onNavigate={handleNavigate}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <ArcadeHome
            storageData={storageData}
            onPlayGame={handlePlayGame}
          />
        )}

        {activePage === 'scores' && (
          <MyScoresPage
            storageData={storageData}
            onPlayGame={handlePlayGame}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            settings={storageData.settings}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
          />
        )}

        {activePage === 'play' && LazyGameComponent && (
          <Suspense
            fallback={
              <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                <div className="font-display font-bold text-lg text-cyan-300">
                  กำลังเข้าสู่เกม {activeGameMeta?.titleTh}...
                </div>
              </div>
            }
          >
            <LazyGameComponent
              onExitToArcade={() => {
                refreshStorage();
                setActivePage('home');
                setActiveGameId(null);
              }}
            />
          </Suspense>
        )}
      </main>

      <footer className="border-t border-indigo-500/20 bg-[#060914] py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="font-display text-slate-200">BreakTime Arcade v1.0</strong> — พักแป๊บ เกมเพลิน
          </div>
          <div>
            ไม่ต้องลงทะเบียน • ไม่มีโฆษณา • บันทึกความคืบหน้าในเครื่องอัตโนมัติ
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
