import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Star,
  Trophy,
  Clock,
  Sparkles,
  Flame,
  ZoomIn,
  Maximize2,
  Minimize2,
  Home,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import type { GameMode } from '../../../types/arcade';
import type { SpotLevelDefinition } from '../../../types/spot';
import {
  buildScenePair,
  calculateStarRating,
  detectDifferenceHit,
} from '../engine/sceneEngine';
import { SceneCanvas, type FloatingFeedback } from './SceneCanvas';
import { soundService } from '../../../services/soundService';
import {
  loadStorageData,
  recordSpotLevelCompletion,
  recordSpotLevelFailedAttempt,
} from '../../../storage/storageService';

interface GamePlayScreenProps {
  level: SpotLevelDefinition;
  mode: GameMode;
  onSelectNextLevel: (nextLevelId: number) => void;
  onSwitchMode: (mode: GameMode) => void;
  onBackToLevelSelect: () => void;
  onBackToArcade: () => void;
  onStorageUpdated: () => void;
}

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  level,
  mode,
  onSelectNextLevel,
  onSwitchMode,
  onBackToLevelSelect,
  onBackToArcade,
  onStorageUpdated,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Deterministically build left and right scenes once per level
  const scenePair = useMemo(() => buildScenePair(level), [level]);

  // Game state
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => new Set());
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [hintsRemaining, setHintsRemaining] = useState<number>(level.maxHints);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);
  const [wrongClicks, setWrongClicks] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pausedByTabSwitch, setPausedByTabSwitch] = useState<boolean>(false);
  const [status, setStatus] = useState<'playing' | 'completed' | 'gameover'>('playing');
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [timeBonusAwarded, setTimeBonusAwarded] = useState<number>(0);
  const [statusBanner, setStatusBanner] = useState<string>('คลิกหรือแตะจุดที่แตกต่างบนภาพใดก็ได้');
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);

  const lastHitTimestampRef = useRef<number>(0);

  // Reset state whenever level or mode changes
  const resetGame = useCallback(() => {
    setSolvedIds(new Set());
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHintsRemaining(level.maxHints);
    setHintsUsed(0);
    setActiveHintId(null);
    setWrongClicks(0);
    setElapsedSec(0);
    setIsPaused(false);
    setPausedByTabSwitch(false);
    setStatus('playing');
    setEarnedStars(0);
    setTimeBonusAwarded(0);
    setStatusBanner('คลิกหรือแตะจุดที่แตกต่างบนภาพใดก็ได้');
    setFeedbacks([]);
    lastHitTimestampRef.current = 0;
  }, [level]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Auto-pause when switching browser tabs (Requirement 1 & 6)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && status === 'playing') {
        const storage = loadStorageData();
        if (storage.settings.autoPauseOnTabSwitch) {
          setIsPaused(true);
          setPausedByTabSwitch(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status]);

  // Timer tick (1 second interval while playing & not paused)
  useEffect(() => {
    if (status !== 'playing' || isPaused) return;

    const timer = window.setInterval(() => {
      setElapsedSec((prev) => {
        const next = prev + 1;
        if (mode === 'challenge' && next >= level.timeLimitSec) {
          setStatus('gameover');
          soundService.playGameOver();
          recordSpotLevelFailedAttempt({
            levelId: level.id,
            elapsedSec: level.timeLimitSec,
            differencesFound: solvedIds.size,
            hintsUsed,
            maxCombo,
          });
          onStorageUpdated();
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    status,
    isPaused,
    mode,
    level.timeLimitSec,
    level.id,
    solvedIds.size,
    hintsUsed,
    maxCombo,
    onStorageUpdated,
  ]);

  const pushFloatingFeedback = useCallback(
    (fb: Omit<FloatingFeedback, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setFeedbacks((prev) => [...prev.slice(-4), { ...fb, id }]);
      window.setTimeout(() => {
        setFeedbacks((prev) => prev.filter((item) => item.id !== id));
      }, 850);
    },
    []
  );

  // Handle clicking/touching either scene
  const handleSceneClick = useCallback(
    (normX: number, normY: number) => {
      if (status !== 'playing' || isPaused) return;

      const hitResult = detectDifferenceHit(
        normX,
        normY,
        level.differences,
        solvedIds
      );

      if (hitResult.status === 'already-solved') {
        setStatusBanner('จุดนี้ค้นพบไปแล้ว ลองมองหาจุดอื่นดูนะ!');
        return;
      }

      if (hitResult.status === 'miss') {
        soundService.playWrongClick();
        setWrongClicks((prev) => prev + 1);
        setCombo(0);

        if (mode === 'challenge') {
          const penalty = level.wrongClickPenalty;
          setScore((prev) => Math.max(0, prev - penalty));
          setStatusBanner(`ยังไม่ใช่นะ! (-${penalty} คะแนน)`);
        } else {
          setStatusBanner('บริเวณนี้ยังเหมือนกันอยู่ ลองสังเกตจุดอื่นดูนะ');
        }

        pushFloatingFeedback({
          x: normX,
          y: normY,
          type: 'wrong',
          text: '×',
        });
        return;
      }

      // HIT! Found a new difference
      const foundDiff = hitResult.difference;
      const now = Date.now();
      const withinComboWindow =
        lastHitTimestampRef.current > 0 && now - lastHitTimestampRef.current <= 8000;
      const nextCombo = withinComboWindow ? combo + 1 : 1;
      lastHitTimestampRef.current = now;

      const nextMaxCombo = Math.max(maxCombo, nextCombo);
      const comboBonus = nextCombo > 1 ? (nextCombo - 1) * 25 : 0;
      const pointsEarned = 100 + comboBonus;

      const nextSolved = new Set(solvedIds);
      nextSolved.add(foundDiff.id);

      setSolvedIds(nextSolved);
      setCombo(nextCombo);
      setMaxCombo(nextMaxCombo);
      if (activeHintId === foundDiff.id) {
        setActiveHintId(null);
      }

      pushFloatingFeedback({
        x: foundDiff.position.x,
        y: foundDiff.position.y,
        type: 'correct',
        text: comboBonus > 0 ? `+${pointsEarned} COMBO!` : `+${pointsEarned}`,
      });

      const remainingCount = level.differences.length - nextSolved.size;

      if (remainingCount > 0) {
        soundService.playCorrectFound(nextCombo);
        setScore((prev) => prev + pointsEarned);
        setStatusBanner(
          `เก่งมาก! พบ "${foundDiff.labelTh}" แล้ว • เหลืออีก ${remainingCount} จุด`
        );
      } else {
        // Level Completed!
        soundService.playLevelComplete();
        const remainingSec = Math.max(0, level.timeLimitSec - elapsedSec);
        const timeBonus = mode === 'challenge' ? remainingSec * 5 : 50;
        const finalScore = Math.max(0, score + pointsEarned + timeBonus);

        const stars = calculateStarRating({
          mode,
          remainingSec,
          timeLimitSec: level.timeLimitSec,
          wrongClicks,
          hintsUsed,
        });

        setScore(finalScore);
        setTimeBonusAwarded(timeBonus);
        setEarnedStars(stars);
        setStatus('completed');
        setStatusBanner('ผ่านด่านแล้ว! ยอดเยี่ยมมาก!');

        recordSpotLevelCompletion({
          levelId: level.id,
          score: finalScore,
          stars,
          elapsedSec: Math.max(1, elapsedSec),
          differencesFound: level.differences.length,
          hintsUsed,
          maxCombo: nextMaxCombo,
          mode,
        });
        onStorageUpdated();
      }
    },
    [
      status,
      isPaused,
      level,
      solvedIds,
      mode,
      combo,
      maxCombo,
      activeHintId,
      elapsedSec,
      score,
      wrongClicks,
      hintsUsed,
      pushFloatingFeedback,
      onStorageUpdated,
    ]
  );

  // Handle Hint button click (Requirement 8)
  const handleUseHint = () => {
    if (status !== 'playing' || isPaused) return;
    if (hintsRemaining <= 0) return;

    // Pick first unsolved difference
    const unsolved = level.differences.filter((d) => !solvedIds.has(d.id));
    if (unsolved.length === 0) return;

    // If a hint is already active and still unsolved, re-announce it without charging twice
    if (activeHintId && !solvedIds.has(activeHintId)) {
      soundService.playHint();
      setStatusBanner('ดูวงแหวนสีทองที่กะพริบบนภาพ แล้วคลิกจุดนั้นด้วยตัวเองเลย!');
      return;
    }

    const target = unsolved[0];
    soundService.playHint();
    setActiveHintId(target.id);
    setHintsRemaining((prev) => Math.max(0, prev - 1));
    setHintsUsed((prev) => prev + 1);

    if (mode === 'challenge') {
      setScore((prev) => Math.max(0, prev - 50));
      setStatusBanner(`ใช้คำใบ้ (-50 คะแนน): สังเกตวงแหวนสีทองแล้วคลิกจุดนั้นเลย!`);
    } else {
      setStatusBanner(`คำใบ้: สังเกตบริเวณวงแหวนสีทองแล้วคลิกจุดที่ต่างกันได้เลย!`);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const remainingDifferences = level.differences.length - solvedIds.size;
  const remainingTimeSec = Math.max(0, level.timeLimitSec - elapsedSec);
  const progressPercent = Math.round(
    (solvedIds.size / level.differences.length) * 100
  );

  return (
    <div
      ref={containerRef}
      className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4 bg-[#080B1A]"
    >
      {/* Top HUD Bar */}
      <div className="bg-[#111633]/95 border border-indigo-500/30 rounded-2xl p-3.5 sm:p-4 shadow-neon-purple space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Navigation & Level Info */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid="back-to-levels-btn"
              onClick={() => {
                soundService.playClick();
                onBackToLevelSelect();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              เลือกระดับ
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-cyan-300 text-sm sm:text-base">
                  ด่านที่ {level.id}: {level.titleTh}
                </span>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    mode === 'challenge'
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {mode === 'challenge' ? (
                    <>
                      <Flame className="w-3 h-3" /> โหมดท้าทาย
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" /> โหมดพักสมอง
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-400">{statusBanner}</p>
            </div>
          </div>

          {/* Center/Right: Stats Pills (Remaining Diffs, Score, Timer) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Remaining Counter */}
            <div
              data-testid="remaining-differences-badge"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F26] border border-emerald-500/30"
            >
              <span className="text-xs text-slate-300">
                เหลืออีก <strong className="text-emerald-300 font-display text-sm">{remainingDifferences}</strong> จุด
              </span>
              <div className="flex items-center gap-1">
                {level.differences.map((d) => (
                  <span
                    key={d.id}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      solvedIds.has(d.id)
                        ? 'bg-emerald-400 scale-110 shadow-[0_0_8px_#34d399]'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Score & Combo */}
            <div
              data-testid="current-score-badge"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F26] border border-amber-500/30"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300">คะแนน:</span>
              <span className="font-display font-bold text-amber-300 text-sm sm:text-base">
                {score.toLocaleString()}
              </span>
              {combo > 1 && (
                <span className="px-1.5 py-0.5 rounded-md bg-pink-500 text-white text-[10px] font-bold animate-bounce">
                  COMBO x{combo}
                </span>
              )}
            </div>

            {/* Timer */}
            <div
              data-testid="timer-badge"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B0F26] border ${
                mode === 'challenge' && remainingTimeSec <= 20
                  ? 'border-rose-500 text-rose-300 animate-pulse'
                  : 'border-cyan-500/30 text-cyan-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-display font-bold text-sm">
                {mode === 'challenge'
                  ? formatTime(remainingTimeSec)
                  : formatTime(elapsedSec)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom HUD Row: Progress Bar & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Progress Bar */}
          <div className="flex-1 min-w-[160px] flex items-center gap-3">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-display font-semibold text-slate-300 whitespace-nowrap">
              {solvedIds.size}/{level.differences.length}
            </span>
          </div>

          {/* Action Buttons: Hint, Zoom, Pause, Restart, Fullscreen */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="hint-button"
              disabled={hintsRemaining <= 0 || status !== 'playing' || isPaused}
              onClick={handleUseHint}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-display font-semibold text-xs sm:text-sm transition ${
                hintsRemaining > 0 && status === 'playing' && !isPaused
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              ขอคำใบ้ ({hintsRemaining})
            </button>

            <button
              type="button"
              data-testid="zoom-button"
              onClick={() => {
                soundService.playClick();
                setZoom((prev) => (prev === 1 ? 1.4 : prev === 1.4 ? 1.8 : 1));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition"
              title="ซูมขยายภาพ"
            >
              <ZoomIn className="w-4 h-4 text-cyan-400" />
              {zoom}x
            </button>

            <button
              type="button"
              data-testid="pause-button"
              onClick={() => {
                soundService.playClick();
                setIsPaused((prev) => !prev);
                setPausedByTabSwitch(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  เล่นต่อ
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  หยุดชั่วคราว
                </>
              )}
            </button>

            <button
              type="button"
              data-testid="restart-button"
              onClick={() => {
                soundService.playClick();
                resetGame();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition"
            >
              <RotateCcw className="w-4 h-4 text-pink-400" />
              เริ่มใหม่
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
              title="เล่นแบบเต็มหน้าจอ"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Side-by-Side (Desktop) / Stacked (Mobile) Dual Scene Viewport */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SceneCanvas
            side="left"
            labelTh="ภาพต้นฉบับ (Original)"
            theme={level.theme}
            objects={scenePair.leftObjects}
            differences={level.differences}
            solvedIds={solvedIds}
            activeHintId={activeHintId}
            feedbacks={feedbacks}
            zoom={zoom}
            disabled={isPaused || status !== 'playing'}
            onNormalizedClick={(x, y) => handleSceneClick(x, y)}
          />

          <SceneCanvas
            side="right"
            labelTh="ภาพค้นหาจุดต่าง (Modified)"
            theme={level.theme}
            objects={scenePair.rightObjects}
            differences={level.differences}
            solvedIds={solvedIds}
            activeHintId={activeHintId}
            feedbacks={feedbacks}
            zoom={zoom}
            disabled={isPaused || status !== 'playing'}
            onNormalizedClick={(x, y) => handleSceneClick(x, y)}
          />
        </div>

        {/* Pause Overlay */}
        {isPaused && status === 'playing' && (
          <div
            data-testid="pause-overlay"
            className="absolute inset-0 z-20 rounded-2xl bg-[#080B1A]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border border-indigo-500/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4">
              <Pause className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">
              หยุดชั่วคราว
            </h2>
            <p className="text-slate-300 text-sm max-w-md mt-2">
              {pausedByTabSwitch
                ? 'ระบบหยุดเวลาให้อัตโนมัติเนื่องจากคุณสลับไปทำงานแท็บอื่น พร้อมเมื่อไหร่กด "เล่นต่อ" ได้เลย!'
                : 'พักสายตาสักครู่ เมื่อพร้อมแล้วกดปุ่มด้านล่างเพื่อเล่นต่อได้ทันที'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                type="button"
                data-testid="resume-button"
                onClick={() => {
                  soundService.playClick();
                  setIsPaused(false);
                  setPausedByTabSwitch(false);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display font-bold shadow-neon-cyan transition"
              >
                <Play className="w-5 h-5 fill-current" />
                เล่นต่อ
              </button>
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onBackToArcade();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-semibold border border-slate-700 transition"
              >
                <Home className="w-4 h-4" />
                กลับหน้ารวมเกม
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Level Completed Modal */}
      {status === 'completed' && (
        <div
          data-testid="level-complete-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#111633] border-2 border-cyan-400/50 p-6 sm:p-8 text-center shadow-neon-cyan space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-semibold">
              LEVEL COMPLETED
            </div>

            <h2 className="text-3xl font-display font-extrabold text-white">
              ผ่านด่านแล้ว!
            </h2>
            <p className="text-slate-300 text-sm">
              คุณค้นพบจุดแตกต่างครบทั้ง {level.differences.length} จุดในด่าน &ldquo;{level.titleTh}&rdquo;
            </p>

            {/* Star Rating Reveal */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-12 h-12 transition-transform duration-500 ${
                    s <= earnedStars
                      ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Score & Time Summary */}
            <div className="grid grid-cols-2 gap-3 bg-[#0B0F26] p-4 rounded-2xl border border-indigo-500/25 text-left">
              <div>
                <span className="text-xs text-slate-400 block">คะแนนที่ได้</span>
                <span
                  data-testid="modal-final-score"
                  className="text-2xl font-display font-bold text-amber-300"
                >
                  {score.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">เวลาที่ใช้</span>
                <span className="text-2xl font-display font-bold text-cyan-300">
                  {formatTime(Math.max(1, elapsedSec))}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>โบนัสเวลา: +{timeBonusAwarded}</span>
                <span>คอมโบสูงสุด: x{maxCombo}</span>
                <span>คำใบ้ที่ใช้: {hintsUsed}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {level.id < 24 && (
                <button
                  type="button"
                  data-testid="next-level-button"
                  onClick={() => {
                    soundService.playClick();
                    onSelectNextLevel(level.id + 1);
                  }}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display font-bold text-base flex items-center justify-center gap-2 shadow-neon-cyan transition"
                >
                  เล่นด่านต่อไป (ด่านที่ {level.id + 1})
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  data-testid="replay-level-button"
                  onClick={() => {
                    soundService.playClick();
                    resetGame();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-semibold text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  เล่นอีกครั้ง
                </button>

                <button
                  type="button"
                  data-testid="modal-back-arcade-button"
                  onClick={() => {
                    soundService.playClick();
                    onBackToArcade();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-semibold text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <Home className="w-4 h-4" />
                  กลับหน้ารวมเกม
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Mode Game Over Modal */}
      {status === 'gameover' && (
        <div
          data-testid="game-over-modal"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#111633] border-2 border-rose-500/50 p-6 sm:p-8 text-center shadow-neon-pink space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              หมดเวลาแล้ว!
            </h2>
            <p className="text-slate-300 text-sm">
              คุณค้นพบจุดแตกต่างได้ {solvedIds.size} จาก {level.differences.length} จุด • ลองใหม่อีกครั้งหรือเปลี่ยนเป็นโหมดพักสมองได้นะ!
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                data-testid="retry-level-button"
                onClick={() => {
                  soundService.playClick();
                  resetGame();
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-display font-bold text-base flex items-center justify-center gap-2 shadow-neon-pink transition"
              >
                <RotateCcw className="w-5 h-5" />
                ลองอีกครั้ง
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onSwitchMode('relax');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-display font-semibold text-sm transition"
              >
                สลับเป็นโหมดพักสมอง (ไม่จับเวลา)
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onBackToArcade();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-semibold text-sm border border-slate-700 transition"
              >
                กลับหน้ารวมเกม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
