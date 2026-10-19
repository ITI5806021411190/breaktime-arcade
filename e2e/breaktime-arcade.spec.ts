import { test, expect } from '@playwright/test';

// Level 1 normalized difference positions (from SPOT_LEVELS[0]):
// sky-cloud-1: (44, 14)
// sky-cloud-2: (78, 17)
// sky-bird: (62, 22)
const LEVEL_1_DIFF_POSITIONS = [
  { x: 44, y: 14 },
  { x: 78, y: 17 },
  { x: 62, y: 22 },
];

async function clickNormalizedOnSvg(
  svgLocator: ReturnType<import('@playwright/test').Page['getByTestId']>,
  normX: number,
  normY: number
) {
  const box = await svgLocator.boundingBox();
  if (!box) throw new Error('SVG boundingBox not found');
  await svgLocator.click({
    position: {
      x: (normX / 100) * box.width,
      y: (normY / 100) * box.height,
    },
  });
}

test.describe('BreakTime Arcade v1.0 — End-to-End & Responsive QA', () => {
  test('Full Definition of Done flow: Home -> Game -> Level 1 -> Hint/Pause/Score -> Level 2 -> Reload Persistence', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // 1. Verify Home Dashboard & 10 Games
    await expect(page.getByTestId('play-game-btn-spot-the-difference')).toBeEnabled();
    await expect(page.getByTestId('play-game-btn-snake-classic')).toBeDisabled();
    await expect(page.getByTestId('play-game-btn-block-puzzle')).toBeDisabled();

    // 2. Open My Scores and verify Empty State before playing
    await page.getByTestId('nav-scores-btn').click();
    await expect(page.getByTestId('scores-empty-state')).toBeVisible();

    // 3. Go back Home and click Spot the Difference
    await page.getByTestId('nav-home-btn').click();
    await page.getByTestId('play-game-btn-spot-the-difference').click();

    // 4. Verify Level Select screen: Level 1 unlocked, Level 2 locked
    await expect(page.getByTestId('play-level-btn-1')).toBeEnabled();
    await expect(page.getByTestId('play-level-btn-2')).toBeDisabled();

    // Switch to Challenge Mode and start Level 1
    await page.getByTestId('mode-select-challenge').click();
    await page.getByTestId('play-level-btn-1').click();

    // 5. Verify both Left and Right SVG canvases are visible
    const leftCanvas = page.getByTestId('scene-canvas-left');
    const rightCanvas = page.getByTestId('scene-canvas-right');
    await expect(leftCanvas).toBeVisible();
    await expect(rightCanvas).toBeVisible();

    // 6. Click a wrong spot (bottom-left corner 5, 92) -> should NOT increase score above 0
    await clickNormalizedOnSvg(rightCanvas, 5, 92);
    await expect(page.getByTestId('current-score-badge')).toContainText('0');

    // 7. Click Hint button -> should show hint ring without solving
    await page.getByTestId('hint-button').click();
    await expect(page.getByTestId('remaining-differences-badge')).toContainText('3');

    // 8. Click First Difference on Left Canvas -> Score increases, remaining = 2
    await clickNormalizedOnSvg(
      leftCanvas,
      LEVEL_1_DIFF_POSITIONS[0].x,
      LEVEL_1_DIFF_POSITIONS[0].y
    );
    await expect(page.getByTestId('remaining-differences-badge')).toContainText('2');
    const scoreAfterFirst = await page.getByTestId('current-score-badge').textContent();

    // 9. Click the SAME First Difference again -> Score must NOT increase
    await clickNormalizedOnSvg(
      rightCanvas,
      LEVEL_1_DIFF_POSITIONS[0].x,
      LEVEL_1_DIFF_POSITIONS[0].y
    );
    await expect(page.getByTestId('remaining-differences-badge')).toContainText('2');
    await expect(page.getByTestId('current-score-badge')).toHaveText(scoreAfterFirst!);

    // 10. Test Pause and Resume
    await page.getByTestId('pause-button').click();
    await expect(page.getByTestId('pause-overlay')).toBeVisible();
    await page.getByTestId('resume-button').click();
    await expect(page.getByTestId('pause-overlay')).toBeHidden();

    // 11. Click remaining 2 differences on Right Canvas -> Level Completed!
    await clickNormalizedOnSvg(
      rightCanvas,
      LEVEL_1_DIFF_POSITIONS[1].x,
      LEVEL_1_DIFF_POSITIONS[1].y
    );
    await clickNormalizedOnSvg(
      rightCanvas,
      LEVEL_1_DIFF_POSITIONS[2].x,
      LEVEL_1_DIFF_POSITIONS[2].y
    );

    await expect(page.getByTestId('level-complete-modal')).toBeVisible();

    // 12. Click Next Level -> transitions to Level 2
    await page.getByTestId('next-level-button').click();
    await expect(page.getByText(/ด่านที่ 2:/)).toBeVisible();

    // 13. Go back to Home, reload browser, and verify persistence!
    await page.getByTestId('header-logo-btn').click();
    await page.reload();

    await expect(page.getByTestId('recently-played-banner')).toContainText('จับผิดภาพ');
    await expect(page.getByTestId('game-best-score-spot-the-difference')).toBeVisible();

    // Check My Scores page after reload
    await page.getByTestId('nav-scores-btn').click();
    await expect(page.getByTestId('stats-levels-completed')).toContainText('1');

    // Check Level 2 is still unlocked after reload
    await page.getByTestId('nav-home-btn').click();
    await page.getByTestId('play-game-btn-spot-the-difference').click();
    await expect(page.getByTestId('play-level-btn-2')).toBeEnabled();

    expect(errors).toEqual([]);
  });

  test('Responsive Viewports (1366x768, Tablet 768x1024, Mobile 390px, Mobile 360px) & Hit Detection Accuracy after Resize', async ({
    page,
  }) => {
    const viewports = [
      { width: 1366, height: 768 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
      { width: 360, height: 800 },
    ];

    await page.goto('/');
    await page.getByTestId('hero-play-now-btn').click();
    await page.getByTestId('play-level-btn-1').click();

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await expect(page.getByTestId('scene-canvas-left')).toBeVisible();
      await expect(page.getByTestId('scene-canvas-right')).toBeVisible();
    }

    // At 360px mobile width, verify hit detection still works accurately on resized SVG
    const rightCanvas = page.getByTestId('scene-canvas-right');
    await clickNormalizedOnSvg(
      rightCanvas,
      LEVEL_1_DIFF_POSITIONS[0].x,
      LEVEL_1_DIFF_POSITIONS[0].y
    );
    await expect(page.getByTestId('remaining-differences-badge')).toContainText('2');
  });
});
