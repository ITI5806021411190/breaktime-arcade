import type {
  DifferenceMetadata,
  SceneObject,
  SpotLevelDefinition,
} from '../../../types/spot';

export interface BuiltScenePair {
  leftObjects: SceneObject[];
  rightObjects: SceneObject[];
}

/**
 * Deterministically builds the Left (original) and Right (modified) scene object lists
 * from a single base scene definition and its difference metadata.
 */
export function buildScenePair(level: SpotLevelDefinition): BuiltScenePair {
  const leftObjects: SceneObject[] = level.baseObjects
    .map((obj) => ({ ...obj }))
    .sort((a, b) => a.layerOrder - b.layerOrder);

  const rightMap = new Map<string, SceneObject>();
  for (const obj of level.baseObjects) {
    rightMap.set(obj.id, { ...obj });
  }

  for (const diff of level.differences) {
    const target = rightMap.get(diff.targetObjectId);
    const { patch } = diff;

    switch (diff.type) {
      case 'remove-object': {
        rightMap.delete(diff.targetObjectId);
        break;
      }
      case 'add-object': {
        if (patch.addedObject) {
          rightMap.set(patch.addedObject.id, { ...patch.addedObject });
        }
        break;
      }
      case 'change-color': {
        if (target) {
          rightMap.set(target.id, {
            ...target,
            color: patch.color ?? target.color,
            secondaryColor: patch.secondaryColor ?? target.secondaryColor,
            accentColor: patch.accentColor ?? target.accentColor,
          });
        }
        break;
      }
      case 'change-size': {
        if (target) {
          const factor = patch.scale ?? 1.35;
          rightMap.set(target.id, {
            ...target,
            scale: (target.scale ?? 1) * factor,
          });
        }
        break;
      }
      case 'move-position': {
        if (target) {
          rightMap.set(target.id, {
            ...target,
            x: target.x + (patch.dx ?? 0),
            y: target.y + (patch.dy ?? 0),
          });
        }
        break;
      }
      case 'change-shape': {
        if (target) {
          rightMap.set(target.id, {
            ...target,
            shape: patch.shape ?? target.shape,
            variant: patch.variant ?? target.variant,
            flipX: patch.flipX !== undefined ? patch.flipX : target.flipX,
            rotation: patch.rotation !== undefined ? patch.rotation : target.rotation,
            color: patch.color ?? target.color,
          });
        }
        break;
      }
      case 'replace-detail': {
        if (target) {
          rightMap.set(target.id, {
            ...target,
            detail: patch.detail ?? target.detail,
            variant: patch.variant ?? target.variant,
            secondaryColor: patch.secondaryColor ?? target.secondaryColor,
            accentColor: patch.accentColor ?? target.accentColor,
          });
        }
        break;
      }
    }
  }

  const rightObjects = Array.from(rightMap.values()).sort(
    (a, b) => a.layerOrder - b.layerOrder
  );

  return { leftObjects, rightObjects };
}

export type HitDetectionResult =
  | { status: 'hit'; difference: DifferenceMetadata }
  | { status: 'already-solved'; difference: DifferenceMetadata }
  | { status: 'miss' };

/**
 * Checks whether a click/touch at normalized coordinates (normX, normY) in [0..100, 0..100]
 * hits any difference in the level.
 */
export function detectDifferenceHit(
  normX: number,
  normY: number,
  differences: DifferenceMetadata[],
  solvedIds: ReadonlySet<string>
): HitDetectionResult {
  // Check unsolved differences first (closest match within hitbox radius)
  let bestUnsolved: { diff: DifferenceMetadata; dist: number } | null = null;
  let bestSolved: { diff: DifferenceMetadata; dist: number } | null = null;

  for (const diff of differences) {
    const centers: Array<{ x: number; y: number }> = [
      { x: diff.hitbox.x, y: diff.hitbox.y },
      { x: diff.position.x, y: diff.position.y },
    ];

    if (diff.type === 'move-position' && (diff.patch.dx || diff.patch.dy)) {
      centers.push({
        x: diff.hitbox.x + (diff.patch.dx ?? 0),
        y: diff.hitbox.y + (diff.patch.dy ?? 0),
      });
    }

    const minDist = Math.min(
      ...centers.map((c) => Math.hypot(normX - c.x, normY - c.y))
    );

    if (minDist <= diff.hitbox.radius) {
      if (solvedIds.has(diff.id)) {
        if (!bestSolved || minDist < bestSolved.dist) {
          bestSolved = { diff, dist: minDist };
        }
      } else {
        if (!bestUnsolved || minDist < bestUnsolved.dist) {
          bestUnsolved = { diff, dist: minDist };
        }
      }
    }
  }

  if (bestUnsolved) {
    return { status: 'hit', difference: bestUnsolved.diff };
  }

  if (bestSolved) {
    return { status: 'already-solved', difference: bestSolved.diff };
  }

  return { status: 'miss' };
}

export interface LevelValidationReport {
  levelId: number;
  valid: boolean;
  errors: string[];
}

export function validateLevelIntegrity(level: SpotLevelDefinition): LevelValidationReport {
  const errors: string[] = [];

  const expectedDiffCount =
    level.difficulty === 'easy' ? 3 : level.difficulty === 'normal' ? 5 : 7;

  if (level.differences.length !== expectedDiffCount) {
    errors.push(
      `Level ${level.id} (${level.difficulty}) has ${level.differences.length} differences, expected ${expectedDiffCount}`
    );
  }

  const baseIds = new Set(level.baseObjects.map((o) => o.id));
  const diffIds = new Set<string>();
  const targetObjIds = new Set<string>();

  for (const diff of level.differences) {
    if (diffIds.has(diff.id)) {
      errors.push(`Duplicate difference ID "${diff.id}" in level ${level.id}`);
    }
    diffIds.add(diff.id);

    if (targetObjIds.has(diff.targetObjectId)) {
      errors.push(
        `Multiple differences target the same object "${diff.targetObjectId}" in level ${level.id}`
      );
    }
    targetObjIds.add(diff.targetObjectId);

    if (diff.type === 'add-object') {
      if (!diff.patch.addedObject) {
        errors.push(`Difference "${diff.id}" is add-object but missing patch.addedObject`);
      }
    } else {
      if (!baseIds.has(diff.targetObjectId)) {
        errors.push(
          `Difference "${diff.id}" targets non-existent base object "${diff.targetObjectId}"`
        );
      }
    }

    // Check bounds (must be inside 4..96 so never clipped by edges)
    if (
      diff.position.x < 4 ||
      diff.position.x > 96 ||
      diff.position.y < 4 ||
      diff.position.y > 96
    ) {
      errors.push(
        `Difference "${diff.id}" position (${diff.position.x}, ${diff.position.y}) is out of safe bounds [4..96]`
      );
    }

    if (
      diff.hitbox.x < 4 ||
      diff.hitbox.x > 96 ||
      diff.hitbox.y < 4 ||
      diff.hitbox.y > 96
    ) {
      errors.push(
        `Difference "${diff.id}" hitbox (${diff.hitbox.x}, ${diff.hitbox.y}) is out of safe bounds [4..96]`
      );
    }

    if (diff.hitbox.radius < 4.5 || diff.hitbox.radius > 16) {
      errors.push(
        `Difference "${diff.id}" hitbox radius ${diff.hitbox.radius} is outside valid range [4.5..16]`
      );
    }
  }

  // Check pairwise overlap of differences
  for (let i = 0; i < level.differences.length; i++) {
    for (let j = i + 1; j < level.differences.length; j++) {
      const a = level.differences[i];
      const b = level.differences[j];
      const dist = Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y);
      if (dist < 8.5) {
        errors.push(
          `Differences "${a.id}" and "${b.id}" in level ${level.id} are too close (dist=${dist.toFixed(2)})`
        );
      }
    }
  }

  return {
    levelId: level.id,
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates stars (1..3) and score breakdown upon completing a level.
 */
export function calculateStarRating(params: {
  mode: 'relax' | 'challenge';
  remainingSec: number;
  timeLimitSec: number;
  wrongClicks: number;
  hintsUsed: number;
}): number {
  if (params.mode === 'relax') {
    if (params.hintsUsed === 0 && params.wrongClicks <= 2) return 3;
    if (params.hintsUsed <= 1 && params.wrongClicks <= 5) return 2;
    return 1;
  }

  const timeRatio = params.remainingSec / Math.max(1, params.timeLimitSec);
  if (timeRatio >= 0.35 && params.wrongClicks <= 2 && params.hintsUsed === 0) {
    return 3;
  }
  if (timeRatio >= 0.15 && params.wrongClicks <= 5) {
    return 2;
  }
  return 1;
}
