import React, { useState, useCallback, useEffect } from 'react';
import type { GameComponentProps, GameMode } from '../../../types/arcade';
import {
  loadStorageData,
  recordGameOpened,
  updateSettings,
} from '../../../storage/storageService';
import { getSpotLevelById } from '../levels/levels';
import { LevelSelectScreen } from './LevelSelectScreen';
import { GamePlayScreen } from './GamePlayScreen';

export const SpotTheDifferenceGame: React.FC<GameComponentProps> = ({
  onExitToArcade,
}) => {
  const [storageState, setStorageState] = useState(() => loadStorageData());
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [mode, setMode] = useState<GameMode>(
    () => loadStorageData().settings.preferredMode
  );

  useEffect(() => {
    const updated = recordGameOpened('spot-the-difference');
    setStorageState(updated);
  }, []);

  const refreshStorage = useCallback(() => {
    setStorageState(loadStorageData());
  }, []);

  const handleSelectMode = (nextMode: GameMode) => {
    setMode(nextMode);
    const updated = updateSettings({ preferredMode: nextMode });
    setStorageState(updated);
  };

  if (activeLevelId === null) {
    return (
      <LevelSelectScreen
        levelsProgress={storageState.spotTheDifference.levels}
        selectedMode={mode}
        onSelectMode={handleSelectMode}
        onSelectLevel={(levelId) => setActiveLevelId(levelId)}
        onBackToArcade={onExitToArcade}
      />
    );
  }

  const currentLevel = getSpotLevelById(activeLevelId);

  return (
    <GamePlayScreen
      level={currentLevel}
      mode={mode}
      onSelectNextLevel={(nextId) => {
        refreshStorage();
        setActiveLevelId(nextId);
      }}
      onSwitchMode={(nextMode) => {
        handleSelectMode(nextMode);
      }}
      onBackToLevelSelect={() => {
        refreshStorage();
        setActiveLevelId(null);
      }}
      onBackToArcade={() => {
        refreshStorage();
        onExitToArcade();
      }}
      onStorageUpdated={refreshStorage}
    />
  );
};

export default SpotTheDifferenceGame;
