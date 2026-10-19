import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Lock,
  Star,
  Play,
  CheckCircle2,
  ArrowLeft,
  Trophy,
  Eye,
} from 'lucide-react';
import type { Difficulty, GameMode, LevelProgress } from '../../../types/arcade';
import { SPOT_LEVELS } from '../levels/levels';
import { soundService } from '../../../services/soundService';

interface LevelSelectScreenProps {
  levelsProgress: Record<number, LevelProgress>;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onSelectLevel: (levelId: number) => void;
  onBackToArcade: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  levelsProgress,
  selectedMode,
  onSelectMode,
  onSelectLevel,
  onBackToArcade,
}) => {
  const [filterDiff, setFilterDiff] = useState<'all' | Difficulty>('all');

  const filteredLevels = SPOT_LEVELS.filter((lvl) =>
    filterDiff === 'all' ? true : lvl.difficulty === filterDiff
  );

  const totalCompleted = Object.values(levelsProgress).filter((l) => l.completed).length;
  const totalStars = Object.values(levelsProgress).reduce((acc, l) => acc + l.stars, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111633]/90 border border-indigo-500/25 rounded-2xl p-5 shadow-neon-purple">
        <div className="flex items-start sm:items-center gap-4">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onBackToArcade();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600/50 transition text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้ารวมเกม
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                GAME 01
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                จับผิดภาพ — Spot the Difference
              </h1>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              ค้นหาจุดแตกต่างจากภาพวาดการ์ตูน 24 ด่าน • เลือกรูปแบบการเล่นและด่านที่ต้องการ
            </p>
          </div>
        </div>

        {/* Summary Badges */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0F26] border border-amber-500/30">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-300">ดาวสะสม:</span>
            <span className="font-display font-bold text-amber-300">{totalStars} / 72</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0F26] border border-emerald-500/30">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300">ผ่านแล้ว:</span>
            <span className="font-display font-bold text-emerald-300">{totalCompleted} / 24</span>
          </div>
        </div>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          data-testid="mode-select-relax"
          onClick={() => {
            soundService.playClick();
            onSelectMode('relax');
          }}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition ${
            selectedMode === 'relax'
              ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border-cyan-400 shadow-neon-cyan'
              : 'bg-[#111633]/70 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              selectedMode === 'relax'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-cyan-400'
            }`}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-white">
                Relax Mode — โหมดพักสมอง
              </span>
              {selectedMode === 'relax' && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                  เลือกอยู่
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              ไม่จับเวลาถอยหลัง • ไม่มี Game Over • ใช้คำใบ้ช่วยได้สบาย ๆ เหมาะสำหรับพักสายตาระหว่างทำงาน
            </p>
          </div>
        </button>

        <button
          type="button"
          data-testid="mode-select-challenge"
          onClick={() => {
            soundService.playClick();
            onSelectMode('challenge');
          }}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition ${
            selectedMode === 'challenge'
              ? 'bg-gradient-to-r from-pink-950/80 to-purple-950/80 border-pink-400 shadow-neon-pink'
              : 'bg-[#111633]/70 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              selectedMode === 'challenge'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-800 text-pink-400'
            }`}
          >
            <Flame className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-white">
                Challenge Mode — โหมดท้าทายเวลา
              </span>
              {selectedMode === 'challenge' && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-pink-400/20 text-pink-300 border border-pink-400/40">
                  เลือกอยู่
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              แข่งกับเวลา • มี Combo Bonus และ Time Bonus • คลิกผิดหักคะแนน • หยุดเวลาอัตโนมัติเมื่อสลับแท็บ!
            </p>
          </div>
        </button>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'ทั้งหมด (24 ด่าน)' },
            { id: 'easy', label: 'ระดับง่าย Easy (3 จุด)' },
            { id: 'normal', label: 'ระดับปานกลาง Normal (5 จุด)' },
            { id: 'hard', label: 'ระดับยาก Hard (7 จุด)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundService.playClick();
                setFilterDiff(tab.id as 'all' | Difficulty);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-semibold transition ${
                filterDiff === tab.id
                  ? 'bg-purple-600 text-white shadow-neon-purple'
                  : 'bg-[#111633] text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          ผ่านด่านก่อนหน้าเพื่อปลดล็อกด่านถัดไป หรือเล่นซ้ำเพื่อทำลายสถิติเดิม
        </span>
      </div>

      {/* 24 Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredLevels.map((lvl) => {
          const prog = levelsProgress[lvl.id] ?? {
            levelId: lvl.id,
            unlocked: lvl.id === 1,
            completed: false,
            stars: 0,
            bestScore: 0,
            fastestTimeSec: null,
            playCount: 0,
          };

          const diffBadge =
            lvl.difficulty === 'easy'
              ? { text: 'ง่าย • 3 จุด', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
              : lvl.difficulty === 'normal'
              ? { text: 'ปานกลาง • 5 จุด', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
              : { text: 'ยาก • 7 จุด', cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };

          return (
            <div
              key={lvl.id}
              data-testid={`level-card-${lvl.id}`}
              className={`relative flex flex-col justify-between rounded-2xl p-4 border transition ${
                prog.unlocked
                  ? 'bg-[#111633] border-indigo-500/30 hover:border-cyan-400/60 shadow-lg'
                  : 'bg-[#0C1024]/80 border-slate-800 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-display font-bold text-sm text-cyan-300">
                    ด่านที่ {lvl.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${diffBadge.cls}`}
                  >
                    {diffBadge.text}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white">
                  {lvl.titleTh}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {lvl.subtitleTh}
                </p>

                {/* Star Rating & Status */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1" aria-label={`ดาวที่ได้ ${prog.stars} จาก 3`}>
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= prog.stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  {prog.completed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ผ่านแล้ว
                    </span>
                  ) : prog.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs text-cyan-300">
                      <Eye className="w-3.5 h-3.5" />
                      พร้อมเล่น
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      ล็อกอยู่
                    </span>
                  )}
                </div>

                {/* Best Score */}
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>คะแนนสูงสุด:</span>
                  <span className="font-display font-semibold text-slate-200">
                    {prog.bestScore > 0 ? prog.bestScore.toLocaleString() : '-'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                data-testid={`play-level-btn-${lvl.id}`}
                disabled={!prog.unlocked}
                onClick={() => {
                  if (!prog.unlocked) return;
                  soundService.playClick();
                  onSelectLevel(lvl.id);
                }}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-display font-semibold text-sm flex items-center justify-center gap-2 transition ${
                  prog.unlocked
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-md cursor-pointer'
                    : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                }`}
              >
                {prog.unlocked ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    {prog.completed ? 'เล่นอีกครั้ง' : 'เริ่มเล่น'}
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    ผ่านด่าน {lvl.id - 1} ก่อน
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
