import { describe, it, expect } from 'vitest';
import { SPOT_LEVELS } from '../levels/levels';
import {
  buildScenePair,
  detectDifferenceHit,
  validateLevelIntegrity,
} from '../engine/sceneEngine';

describe('Spot the Difference — 24 Levels Integrity & Engine', () => {
  it('has at least 24 playable levels divided equally into Easy (8), Normal (8), and Hard (8)', () => {
    expect(SPOT_LEVELS.length).toBe(24);
    expect(SPOT_LEVELS.filter((l) => l.difficulty === 'easy').length).toBe(8);
    expect(SPOT_LEVELS.filter((l) => l.difficulty === 'normal').length).toBe(8);
    expect(SPOT_LEVELS.filter((l) => l.difficulty === 'hard').length).toBe(8);
  });

  it('passes validateLevelIntegrity for every single level (1..24)', () => {
    for (const level of SPOT_LEVELS) {
      const report = validateLevelIntegrity(level);
      expect(report.errors).toEqual([]);
      expect(report.valid).toBe(true);
    }
  });

  it('has exact difference counts and hint limits per difficulty', () => {
    for (const level of SPOT_LEVELS) {
      if (level.difficulty === 'easy') {
        expect(level.differences.length).toBe(3);
        expect(level.maxHints).toBe(3);
      } else if (level.difficulty === 'normal') {
        expect(level.differences.length).toBe(5);
        expect(level.maxHints).toBe(2);
      } else {
        expect(level.differences.length).toBe(7);
        expect(level.maxHints).toBe(1);
      }
    }
  });

  it('deterministically builds identical output across repeated calls', () => {
    for (const level of SPOT_LEVELS) {
      const first = buildScenePair(level);
      const second = buildScenePair(level);
      expect(first).toEqual(second);
      expect(first.leftObjects).not.toEqual(first.rightObjects);
    }
  });

  it('detects every difference in every level by clicking its exact normalized position and rejects duplicate clicks', () => {
    for (const level of SPOT_LEVELS) {
      const solved = new Set<string>();
      for (const diff of level.differences) {
        const hitRes = detectDifferenceHit(
          diff.position.x,
          diff.position.y,
          level.differences,
          solved
        );
        expect(hitRes.status).toBe('hit');
        if (hitRes.status === 'hit') {
          expect(hitRes.difference.id).toBe(diff.id);
          solved.add(hitRes.difference.id);
        }

        // Clicking the same spot again should return already-solved, never hit
        const repeatRes = detectDifferenceHit(
          diff.position.x,
          diff.position.y,
          level.differences,
          solved
        );
        expect(repeatRes.status).toBe('already-solved');
      }
      expect(solved.size).toBe(level.differences.length);
    }
  });
});
