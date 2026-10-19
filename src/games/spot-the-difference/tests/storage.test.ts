import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY,
  loadStorageData,
  recordSpotLevelCompletion,
  updateSettings,
  resetAllProgress,
} from '../../../storage/storageService';

describe('Arcade Storage Service — Persistence & Schema Integrity', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with default state: muted sound, level 1 unlocked, zero stats', () => {
    const state = loadStorageData();
    expect(state.version).toBe(1);
    expect(state.settings.soundEnabled).toBe(false);
    expect(state.stats.totalGamesPlayed).toBe(0);
    expect(state.spotTheDifference.unlockedLevelIds).toEqual([1]);
    expect(state.spotTheDifference.levels[1].unlocked).toBe(true);
    expect(state.spotTheDifference.levels[2].unlocked).toBe(false);
  });

  it('recovers gracefully when localStorage contains corrupted JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{corrupted-json-data');
    const state = loadStorageData();
    expect(state.version).toBe(1);
    expect(state.spotTheDifference.levels[1].unlocked).toBe(true);
  });

  it('unlocks level 2 and saves score/stars when level 1 is completed', () => {
    const next = recordSpotLevelCompletion({
      levelId: 1,
      score: 450,
      stars: 3,
      elapsedSec: 22,
      differencesFound: 3,
      hintsUsed: 0,
      maxCombo: 3,
      mode: 'challenge',
    });

    expect(next.spotTheDifference.levels[1].completed).toBe(true);
    expect(next.spotTheDifference.levels[1].bestScore).toBe(450);
    expect(next.spotTheDifference.levels[1].stars).toBe(3);
    expect(next.spotTheDifference.levels[2].unlocked).toBe(true);
    expect(next.stats.totalLevelsCompleted).toBe(1);
    expect(next.stats.totalGamesPlayed).toBe(1);
    expect(next.lastPlayedGameId).toBe('spot-the-difference');

    // Verify persistence across reload
    const reloaded = loadStorageData();
    expect(reloaded.spotTheDifference.levels[1].bestScore).toBe(450);
    expect(reloaded.spotTheDifference.levels[2].unlocked).toBe(true);
  });

  it('retains higher best score when replaying a level with a lower score', () => {
    recordSpotLevelCompletion({
      levelId: 1,
      score: 500,
      stars: 3,
      elapsedSec: 18,
      differencesFound: 3,
      hintsUsed: 0,
      maxCombo: 3,
      mode: 'challenge',
    });

    const afterReplay = recordSpotLevelCompletion({
      levelId: 1,
      score: 300,
      stars: 2,
      elapsedSec: 40,
      differencesFound: 3,
      hintsUsed: 1,
      maxCombo: 2,
      mode: 'relax',
    });

    expect(afterReplay.spotTheDifference.levels[1].bestScore).toBe(500);
    expect(afterReplay.spotTheDifference.levels[1].stars).toBe(3);
    expect(afterReplay.spotTheDifference.levels[1].fastestTimeSec).toBe(18);
    expect(afterReplay.spotTheDifference.levels[1].playCount).toBe(2);
  });

  it('persists settings updates and preserves settings on progress reset', () => {
    updateSettings({ soundEnabled: true, preferredMode: 'challenge' });
    recordSpotLevelCompletion({
      levelId: 1,
      score: 400,
      stars: 3,
      elapsedSec: 25,
      differencesFound: 3,
      hintsUsed: 0,
      maxCombo: 3,
      mode: 'challenge',
    });

    const afterReset = resetAllProgress();
    expect(afterReset.settings.soundEnabled).toBe(true);
    expect(afterReset.stats.totalGamesPlayed).toBe(0);
    expect(afterReset.spotTheDifference.levels[2].unlocked).toBe(false);
  });
});
