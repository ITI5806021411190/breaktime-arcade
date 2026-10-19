import type {
  ArcadeStorageSchemaV1,
  GameId,
  GameMode,
  LevelProgress,
  UserSettings,
} from '../types/arcade';

export const STORAGE_KEY = 'breaktime_arcade_storage_v1';

export function createDefaultStorageState(): ArcadeStorageSchemaV1 {
  const initialLevels: Record<number, LevelProgress> = {};
  for (let i = 1; i <= 24; i++) {
    initialLevels[i] = {
      levelId: i,
      unlocked: i === 1,
      completed: false,
      stars: 0,
      bestScore: 0,
      fastestTimeSec: null,
      playCount: 0,
    };
  }

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    lastPlayedGameId: null,
    settings: {
      soundEnabled: false, // Muted by default per requirements
      soundVolume: 0.7,
      preferredMode: 'relax',
      hapticsEnabled: true,
      reducedMotion: false,
      autoPauseOnTabSwitch: true,
    },
    stats: {
      totalGamesPlayed: 0,
      totalLevelsCompleted: 0,
      totalDifferencesFound: 0,
      totalHintsUsed: 0,
      totalPlayTimeSec: 0,
      highestCombo: 0,
    },
    gameSummaries: {},
    spotTheDifference: {
      unlockedLevelIds: [1],
      levels: initialLevels,
    },
  };
}

function isValidObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Safely parses and migrates/sanitizes storage data so corrupted JSON or
 * missing fields never break the application.
 */
export function loadStorageData(): ArcadeStorageSchemaV1 {
  const defaults = createDefaultStorageState();
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaults;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidObject(parsed)) {
      return defaults;
    }

    // Merge settings safely
    const rawSettings = isValidObject(parsed.settings) ? parsed.settings : {};
    const settings: UserSettings = {
      soundEnabled:
        typeof rawSettings.soundEnabled === 'boolean'
          ? rawSettings.soundEnabled
          : defaults.settings.soundEnabled,
      soundVolume:
        typeof rawSettings.soundVolume === 'number' &&
        rawSettings.soundVolume >= 0 &&
        rawSettings.soundVolume <= 1
          ? rawSettings.soundVolume
          : defaults.settings.soundVolume,
      preferredMode:
        rawSettings.preferredMode === 'relax' || rawSettings.preferredMode === 'challenge'
          ? rawSettings.preferredMode
          : defaults.settings.preferredMode,
      hapticsEnabled:
        typeof rawSettings.hapticsEnabled === 'boolean'
          ? rawSettings.hapticsEnabled
          : defaults.settings.hapticsEnabled,
      reducedMotion:
        typeof rawSettings.reducedMotion === 'boolean'
          ? rawSettings.reducedMotion
          : defaults.settings.reducedMotion,
      autoPauseOnTabSwitch:
        typeof rawSettings.autoPauseOnTabSwitch === 'boolean'
          ? rawSettings.autoPauseOnTabSwitch
          : defaults.settings.autoPauseOnTabSwitch,
    };

    // Merge stats safely
    const rawStats = isValidObject(parsed.stats) ? parsed.stats : {};
    const stats = {
      totalGamesPlayed:
        typeof rawStats.totalGamesPlayed === 'number' && rawStats.totalGamesPlayed >= 0
          ? rawStats.totalGamesPlayed
          : 0,
      totalLevelsCompleted:
        typeof rawStats.totalLevelsCompleted === 'number' && rawStats.totalLevelsCompleted >= 0
          ? rawStats.totalLevelsCompleted
          : 0,
      totalDifferencesFound:
        typeof rawStats.totalDifferencesFound === 'number' && rawStats.totalDifferencesFound >= 0
          ? rawStats.totalDifferencesFound
          : 0,
      totalHintsUsed:
        typeof rawStats.totalHintsUsed === 'number' && rawStats.totalHintsUsed >= 0
          ? rawStats.totalHintsUsed
          : 0,
      totalPlayTimeSec:
        typeof rawStats.totalPlayTimeSec === 'number' && rawStats.totalPlayTimeSec >= 0
          ? rawStats.totalPlayTimeSec
          : 0,
      highestCombo:
        typeof rawStats.highestCombo === 'number' && rawStats.highestCombo >= 0
          ? rawStats.highestCombo
          : 0,
    };

    // Merge Spot the Difference level progress safely
    const rawSpot = isValidObject(parsed.spotTheDifference) ? parsed.spotTheDifference : {};
    const rawLevels = isValidObject(rawSpot.levels) ? rawSpot.levels : {};
    const mergedLevels: Record<number, LevelProgress> = { ...defaults.spotTheDifference.levels };

    const unlockedSet = new Set<number>([1]);
    if (Array.isArray(rawSpot.unlockedLevelIds)) {
      for (const id of rawSpot.unlockedLevelIds) {
        if (typeof id === 'number' && id >= 1 && id <= 24) {
          unlockedSet.add(id);
        }
      }
    }

    for (let i = 1; i <= 24; i++) {
      const candidate = rawLevels[String(i)] ?? rawLevels[i];
      if (isValidObject(candidate)) {
        const completed = Boolean(candidate.completed);
        const unlocked = i === 1 || Boolean(candidate.unlocked) || unlockedSet.has(i);
        if (unlocked) unlockedSet.add(i);
        if (completed && i < 24) unlockedSet.add(i + 1);

        mergedLevels[i] = {
          levelId: i,
          unlocked,
          completed,
          stars:
            typeof candidate.stars === 'number'
              ? Math.max(0, Math.min(3, Math.floor(candidate.stars)))
              : 0,
          bestScore:
            typeof candidate.bestScore === 'number' && candidate.bestScore >= 0
              ? Math.floor(candidate.bestScore)
              : 0,
          fastestTimeSec:
            typeof candidate.fastestTimeSec === 'number' && candidate.fastestTimeSec >= 0
              ? candidate.fastestTimeSec
              : null,
          playCount:
            typeof candidate.playCount === 'number' && candidate.playCount >= 0
              ? Math.floor(candidate.playCount)
              : 0,
        };
      }
    }

    // Ensure unlocked propagation
    for (const id of unlockedSet) {
      if (mergedLevels[id]) {
        mergedLevels[id].unlocked = true;
      }
    }

    const rawSummaries = isValidObject(parsed.gameSummaries) ? parsed.gameSummaries : {};
    const gameSummaries: ArcadeStorageSchemaV1['gameSummaries'] = {};
    for (const [key, val] of Object.entries(rawSummaries)) {
      if (isValidObject(val) && typeof val.bestScore === 'number') {
        gameSummaries[key as GameId] = {
          gameId: key as GameId,
          bestScore: Math.max(0, Math.floor(val.bestScore)),
          gamesPlayed: typeof val.gamesPlayed === 'number' ? Math.max(0, val.gamesPlayed) : 0,
          totalScoreAccumulated:
            typeof val.totalScoreAccumulated === 'number'
              ? Math.max(0, val.totalScoreAccumulated)
              : 0,
          lastPlayedAt: typeof val.lastPlayedAt === 'string' ? val.lastPlayedAt : null,
        };
      }
    }

    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : defaults.updatedAt,
      lastPlayedGameId:
        typeof parsed.lastPlayedGameId === 'string'
          ? (parsed.lastPlayedGameId as GameId)
          : null,
      settings,
      stats,
      gameSummaries,
      spotTheDifference: {
        unlockedLevelIds: Array.from(unlockedSet).sort((a, b) => a - b),
        levels: mergedLevels,
      },
    };
  } catch {
    return defaults;
  }
}

export function saveStorageData(data: ArcadeStorageSchemaV1): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const payload: ArcadeStorageSchemaV1 = {
      ...data,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota errors in restricted environments
  }
}

export function updateSettings(partial: Partial<UserSettings>): ArcadeStorageSchemaV1 {
  const current = loadStorageData();
  const next: ArcadeStorageSchemaV1 = {
    ...current,
    settings: {
      ...current.settings,
      ...partial,
    },
  };
  saveStorageData(next);
  return next;
}

export function recordGameOpened(gameId: GameId): ArcadeStorageSchemaV1 {
  const current = loadStorageData();
  const next: ArcadeStorageSchemaV1 = {
    ...current,
    lastPlayedGameId: gameId,
  };
  saveStorageData(next);
  return next;
}

export interface CompleteSpotLevelInput {
  levelId: number;
  score: number;
  stars: number;
  elapsedSec: number;
  differencesFound: number;
  hintsUsed: number;
  maxCombo: number;
  mode: GameMode;
}

export function recordSpotLevelCompletion(input: CompleteSpotLevelInput): ArcadeStorageSchemaV1 {
  const current = loadStorageData();
  const levels = { ...current.spotTheDifference.levels };
  const prevLevel = levels[input.levelId] ?? {
    levelId: input.levelId,
    unlocked: true,
    completed: false,
    stars: 0,
    bestScore: 0,
    fastestTimeSec: null,
    playCount: 0,
  };

  const wasAlreadyCompleted = prevLevel.completed;
  const updatedLevel: LevelProgress = {
    levelId: input.levelId,
    unlocked: true,
    completed: true,
    stars: Math.max(prevLevel.stars, Math.min(3, Math.max(1, input.stars))),
    bestScore: Math.max(prevLevel.bestScore, Math.max(0, Math.floor(input.score))),
    fastestTimeSec:
      prevLevel.fastestTimeSec === null
        ? input.elapsedSec
        : Math.min(prevLevel.fastestTimeSec, input.elapsedSec),
    playCount: prevLevel.playCount + 1,
  };
  levels[input.levelId] = updatedLevel;

  // Unlock next level if available
  const unlockedSet = new Set<number>(current.spotTheDifference.unlockedLevelIds);
  unlockedSet.add(input.levelId);
  if (input.levelId < 24) {
    const nextId = input.levelId + 1;
    unlockedSet.add(nextId);
    if (levels[nextId]) {
      levels[nextId] = {
        ...levels[nextId],
        unlocked: true,
      };
    }
  }

  // Compute total best score across all Spot the Difference levels or highest single level score
  const totalBestScore = Object.values(levels).reduce((acc, lvl) => acc + lvl.bestScore, 0);
  const prevGameSummary = current.gameSummaries['spot-the-difference'];

  const nextGameSummary = {
    gameId: 'spot-the-difference' as const,
    bestScore: Math.max(prevGameSummary?.bestScore ?? 0, totalBestScore, updatedLevel.bestScore),
    gamesPlayed: (prevGameSummary?.gamesPlayed ?? 0) + 1,
    totalScoreAccumulated: (prevGameSummary?.totalScoreAccumulated ?? 0) + input.score,
    lastPlayedAt: new Date().toISOString(),
  };

  const completedCount = Object.values(levels).filter((l) => l.completed).length;

  const next: ArcadeStorageSchemaV1 = {
    ...current,
    lastPlayedGameId: 'spot-the-difference',
    settings: {
      ...current.settings,
      preferredMode: input.mode,
    },
    stats: {
      totalGamesPlayed: current.stats.totalGamesPlayed + 1,
      totalLevelsCompleted: Math.max(
        current.stats.totalLevelsCompleted + (wasAlreadyCompleted ? 0 : 1),
        completedCount
      ),
      totalDifferencesFound: current.stats.totalDifferencesFound + input.differencesFound,
      totalHintsUsed: current.stats.totalHintsUsed + input.hintsUsed,
      totalPlayTimeSec: current.stats.totalPlayTimeSec + Math.max(1, Math.round(input.elapsedSec)),
      highestCombo: Math.max(current.stats.highestCombo, input.maxCombo),
    },
    gameSummaries: {
      ...current.gameSummaries,
      'spot-the-difference': nextGameSummary,
    },
    spotTheDifference: {
      unlockedLevelIds: Array.from(unlockedSet).sort((a, b) => a - b),
      levels,
    },
  };

  saveStorageData(next);
  return next;
}

export function recordSpotLevelFailedAttempt(input: {
  levelId: number;
  elapsedSec: number;
  differencesFound: number;
  hintsUsed: number;
  maxCombo: number;
}): ArcadeStorageSchemaV1 {
  const current = loadStorageData();
  const levels = { ...current.spotTheDifference.levels };
  const prevLevel = levels[input.levelId];
  if (prevLevel) {
    levels[input.levelId] = {
      ...prevLevel,
      playCount: prevLevel.playCount + 1,
    };
  }

  const prevGameSummary = current.gameSummaries['spot-the-difference'];
  const next: ArcadeStorageSchemaV1 = {
    ...current,
    lastPlayedGameId: 'spot-the-difference',
    stats: {
      ...current.stats,
      totalGamesPlayed: current.stats.totalGamesPlayed + 1,
      totalDifferencesFound: current.stats.totalDifferencesFound + input.differencesFound,
      totalHintsUsed: current.stats.totalHintsUsed + input.hintsUsed,
      totalPlayTimeSec: current.stats.totalPlayTimeSec + Math.max(1, Math.round(input.elapsedSec)),
      highestCombo: Math.max(current.stats.highestCombo, input.maxCombo),
    },
    gameSummaries: {
      ...current.gameSummaries,
      'spot-the-difference': {
        gameId: 'spot-the-difference',
        bestScore: prevGameSummary?.bestScore ?? 0,
        gamesPlayed: (prevGameSummary?.gamesPlayed ?? 0) + 1,
        totalScoreAccumulated: prevGameSummary?.totalScoreAccumulated ?? 0,
        lastPlayedAt: new Date().toISOString(),
      },
    },
    spotTheDifference: {
      ...current.spotTheDifference,
      levels,
    },
  };
  saveStorageData(next);
  return next;
}

export function resetAllProgress(): ArcadeStorageSchemaV1 {
  const current = loadStorageData();
  const fresh = createDefaultStorageState();
  // Preserve user audio/accessibility preferences
  fresh.settings = { ...current.settings };
  saveStorageData(fresh);
  return fresh;
}
