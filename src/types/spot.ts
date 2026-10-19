import type { Difficulty } from './arcade';

export type SceneThemeId =
  | 'front-garden'
  | 'street-cafe'
  | 'sunny-beach'
  | 'cozy-office'
  | 'night-market'
  | 'animal-farm'
  | 'amusement-park'
  | 'future-city';

export type SceneObjectType =
  | 'background'
  | 'building'
  | 'tree'
  | 'window'
  | 'animal'
  | 'furniture'
  | 'cloud'
  | 'decorative'
  | 'vehicle'
  | 'character'
  | 'light'
  | 'sign'
  | 'food'
  | 'plant';

export type DifferenceType =
  | 'remove-object'
  | 'add-object'
  | 'change-color'
  | 'change-size'
  | 'move-position'
  | 'change-shape'
  | 'replace-detail';

/**
 * All positions (x, y) and sizes are in normalized 0..100 coordinates.
 * Renderer maps x: 0..100 -> 0..1000, y: 0..100 -> 0..750 in SVG viewBox.
 */
export interface SceneObject {
  id: string;
  type: SceneObjectType;
  shape: string; // specific artwork shape identifier
  x: number; // 0..100
  y: number; // 0..100
  width: number; // 0..100
  height: number; // 0..100
  color: string;
  secondaryColor?: string;
  accentColor?: string;
  layerOrder: number;
  rotation?: number;
  flipX?: boolean;
  scale?: number;
  variant?: string; // shape variant e.g. 'round' | 'star' | 'square' | 'crescent'
  detail?: string; // detail variant e.g. 'striped' | 'polka' | 'plain' | 'heart' | 'flower'
  text?: string;
}

export interface DifferencePatch {
  color?: string;
  secondaryColor?: string;
  accentColor?: string;
  scale?: number;
  dx?: number; // delta x in normalized 0..100
  dy?: number; // delta y in normalized 0..100
  shape?: string;
  variant?: string;
  detail?: string;
  flipX?: boolean;
  rotation?: number;
  addedObject?: SceneObject; // used when DifferenceType === 'add-object'
}

export interface DifferenceMetadata {
  id: string;
  targetObjectId: string;
  type: DifferenceType;
  labelTh: string;
  /** Center position in normalized 0..100 coordinates */
  position: {
    x: number;
    y: number;
  };
  /** Hitbox in normalized 0..100 coordinates */
  hitbox: {
    x: number;
    y: number;
    radius: number;
  };
  patch: DifferencePatch;
}

export interface SpotLevelDefinition {
  id: number;
  titleTh: string;
  subtitleTh: string;
  theme: SceneThemeId;
  difficulty: Difficulty;
  timeLimitSec: number; // used in Challenge mode
  maxHints: number; // Easy: 3, Normal: 2, Hard: 1
  wrongClickPenalty: number; // Challenge mode penalty
  baseObjects: SceneObject[];
  differences: DifferenceMetadata[];
}

export interface RuntimeDifferenceState extends DifferenceMetadata {
  solved: boolean;
  solvedAtMs?: number;
}
