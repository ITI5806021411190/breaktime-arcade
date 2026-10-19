import type { LazyExoticComponent, ComponentType } from 'react';

export type GameId =
  | 'spot-the-difference'
  | 'snake-classic'
  | 'space-defender'
  | '2048-challenge'
  | 'memory-match'
  | 'brick-breaker'
  | 'whack-a-mole'
  | 'bubble-shooter'
  | 'maze-escape'
  | 'block-puzzle';

export type GameStatus = 'playable' | 'coming-soon';

export type GameMode = 'relax' | 'challenge';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameComponentProps {
  onExitToArcade: () => void;
}

export interface GameMetadata {
  id: GameId;
  number: number;
  titleTh: string;
  titleEn: string;
  category: string;
  description: string;
  status: GameStatus;
  route: string;
  accentColor: 'purple' | 'cyan' | 'pink' | 'amber' | 'emerald';
  estimatedMinutes: string;
  isFeaturedDaily?: boolean;
  componentLoader?: () => Promise<{ default: ComponentType<GameComponentProps> }>;
  lazyComponent?: LazyExoticComponent<ComponentType<GameComponentProps>>;
}

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  bestScore: number;
  fastestTimeSec: number | null;
  playCount: number;
}

export interface GameSummaryStats {
  gameId: GameId;
  bestScore: number;
  gamesPlayed: number;
  totalScoreAccumulated: number;
  lastPlayedAt: string | null;
}

export interface UserSettings {
  soundEnabled: boolean; // default false per specification
  soundVolume: number; // 0 to 1
  preferredMode: GameMode;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  autoPauseOnTabSwitch: boolean;
}

export interface PersonalStatistics {
  totalGamesPlayed: number;
  totalLevelsCompleted: number;
  totalDifferencesFound: number;
  totalHintsUsed: number;
  totalPlayTimeSec: number;
  highestCombo: number;
}

export interface ArcadeStorageSchemaV1 {
  version: 1;
  updatedAt: string;
  lastPlayedGameId: GameId | null;
  settings: UserSettings;
  stats: PersonalStatistics;
  gameSummaries: Partial<Record<GameId, GameSummaryStats>>;
  spotTheDifference: {
    unlockedLevelIds: number[];
    levels: Record<number, LevelProgress>;
  };
}

export type AppPage = 'home' | 'scores' | 'settings' | 'play';
