import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { App } from '../../../app/App';
import { SPOT_LEVELS } from '../levels/levels';

describe('BreakTime Arcade — Full User Flow & Gameplay Interaction', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.scrollTo = () => {};
  });

  afterEach(() => {
    cleanup();
  });

  it('renders Home dashboard with 10 games, Game 1 playable, and Games 2-10 disabled Coming Soon', () => {
    render(<App />);
    expect(screen.getAllByText('BreakTime Arcade').length).toBeGreaterThan(0);
    expect(screen.getAllByText('พักแป๊บ เกมเพลิน').length).toBeGreaterThan(0);

    const playBtn1 = screen.getByTestId('play-game-btn-spot-the-difference') as HTMLButtonElement;
    expect(playBtn1.disabled).toBe(false);

    const comingSoonGames = [
      'snake-classic',
      'space-defender',
      '2048-challenge',
      'memory-match',
      'brick-breaker',
      'whack-a-mole',
      'bubble-shooter',
      'maze-escape',
      'block-puzzle',
    ];
    for (const id of comingSoonGames) {
      const btn = screen.getByTestId(`play-game-btn-${id}`) as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    }
  });

  it('shows empty state on My Scores page before playing any game', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-scores-btn'));
    expect(screen.getByTestId('scores-empty-state')).toBeTruthy();
    expect(screen.getByText('ยังไม่มีสถิติ เริ่มเล่นเกมแรกกันเลย')).toBeTruthy();
  });

  it('completes Level 1 end-to-end, unlocks Level 2, and persists score', async () => {
    render(<App />);

    // Click Play on Spot the Difference
    fireEvent.click(screen.getByTestId('play-game-btn-spot-the-difference'));

    // Wait for lazy-loaded LevelSelectScreen
    await waitFor(() => {
      expect(screen.getByTestId('play-level-btn-1')).toBeTruthy();
    });

    // Level 1 is unlocked, Level 2 is locked initially
    expect((screen.getByTestId('play-level-btn-1') as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByTestId('play-level-btn-2') as HTMLButtonElement).disabled).toBe(true);

    // Start Level 1
    fireEvent.click(screen.getByTestId('play-level-btn-1'));

    const rightCanvas = await waitFor(() => screen.getByTestId('scene-canvas-right'));
    expect(rightCanvas).toBeTruthy();

    // Test Hint button selects an unfound difference without auto-solving
    fireEvent.click(screen.getByTestId('hint-button'));
    const level1 = SPOT_LEVELS[0];
    expect(screen.getByTestId(`hint-ring-right-${level1.differences[0].id}`)).toBeTruthy();

    // Test Pause and Resume
    fireEvent.click(screen.getByTestId('pause-button'));
    expect(screen.getByTestId('pause-overlay')).toBeTruthy();
    fireEvent.click(screen.getByTestId('resume-button'));

    // Click all 3 differences on Level 1 (default fallback rect is 1000x750)
    for (const diff of level1.differences) {
      const clientX = (diff.position.x / 100) * 1000;
      const clientY = (diff.position.y / 100) * 750;
      fireEvent.click(rightCanvas, {
        clientX,
        clientY,
      });
    }

    // Level Completed modal should appear!
    await waitFor(() => {
      expect(screen.getByTestId('level-complete-modal')).toBeTruthy();
    });

    // Click Next Level (Level 2)
    fireEvent.click(screen.getByTestId('next-level-button'));
    expect(screen.getByText(/ด่านที่ 2:/)).toBeTruthy();

    // Return to Level Select and verify Level 2 is unlocked
    fireEvent.click(screen.getByTestId('back-to-levels-btn'));
    expect((screen.getByTestId('play-level-btn-2') as HTMLButtonElement).disabled).toBe(false);

    // Navigate to My Scores and verify real statistics are recorded
    fireEvent.click(screen.getByTestId('nav-scores-btn'));
    expect(screen.getByTestId('stats-levels-completed').textContent).toContain('1');
  });
});
