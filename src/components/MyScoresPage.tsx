import React from 'react';
import {
  Trophy,
  Star,
  CheckCircle2,
  Gamepad2,
  Flame,
  Eye,
  Clock,
  Play,
  Award,
} from 'lucide-react';
import type { ArcadeStorageSchemaV1, GameId } from '../types/arcade';
import { SPOT_LEVELS } from '../games/spot-the-difference/levels/levels';
import { soundService } from '../services/soundService';

interface MyScoresPageProps {
  storageData: ArcadeStorageSchemaV1;
  onPlayGame: (gameId: GameId) => void;
}

export const MyScoresPage: React.FC<MyScoresPageProps> = ({
  storageData,
  onPlayGame,
}) => {
  const { stats, spotTheDifference, gameSummaries } = storageData;
  const spotLevels = Object.values(spotTheDifference.levels);
  const totalStars = spotLevels.reduce((acc, l) => acc + l.stars, 0);
  const completedLevelsCount = spotLevels.filter((l) => l.completed).length;
  const bestOverallScore = gameSummaries['spot-the-difference']?.bestScore ?? 0;

  const hasAnyHistory =
    stats.totalGamesPlayed > 0 || completedLevelsCount > 0 || bestOverallScore > 0;

  // Achievements derived strictly from real player progress
  const achievements = [
    {
      id: 'first-win',
      title: 'ก้าวแรกสู่อาร์เคด',
      desc: 'ผ่านด่านแรกของเกมจับผิดภาพสำเร็จ',
      unlocked: completedLevelsCount >= 1,
    },
    {
      id: 'easy-clear',
      title: 'สายตาเฉียบคม (Easy Master)',
      desc: 'ผ่านด่านระดับง่ายครบทั้ง 8 ด่าน',
      unlocked: SPOT_LEVELS.filter((l) => l.difficulty === 'easy').every(
        (l) => spotTheDifference.levels[l.id]?.completed
      ),
    },
    {
      id: 'star-collector',
      title: 'นักสะสมดวงดาว',
      desc: 'สะสมดาวครบ 15 ดวงขึ้นไป',
      unlocked: totalStars >= 15,
    },
    {
      id: 'combo-streak',
      title: 'คอมโบสายฟ้าแลบ',
      desc: 'ทำคอมโบต่อเนื่องอย่างน้อย 3 ครั้งติดต่อกัน',
      unlocked: stats.highestCombo >= 3,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111633] border border-indigo-500/30 rounded-2xl p-6 shadow-neon-purple">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-400" />
            สถิติและคะแนนของฉัน (My Scores & Stats)
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            บันทึกความก้าวหน้า คะแนนสูงสุด และรางวัลความสำเร็จจากการเล่นจริงของคุณ
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onPlayGame('spot-the-difference');
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display font-bold text-sm shadow-neon-cyan transition self-start sm:self-center"
        >
          <Play className="w-4 h-4 fill-current" />
          ไปเล่นเกมจับผิดภาพ
        </button>
      </div>

      {!hasAnyHistory ? (
        /* Empty State when player hasn't played any game yet */
        <div
          data-testid="scores-empty-state"
          className="rounded-3xl bg-[#111633]/90 border-2 border-dashed border-indigo-500/35 p-10 sm:p-14 text-center space-y-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">
              ยังไม่มีสถิติ เริ่มเล่นเกมแรกกันเลย
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              เมื่อคุณเริ่มเล่นและผ่านด่านใน BreakTime Arcade คะแนนสูงสุด ดาวสะสม และสถิติส่วนตัวจะถูกบันทึกไว้ที่นี่โดยอัตโนมัติ
            </p>
          </div>
          <button
            type="button"
            data-testid="empty-state-start-btn"
            onClick={() => {
              soundService.playClick();
              onPlayGame('spot-the-difference');
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-display font-bold text-base shadow-neon-cyan transition"
          >
            <Play className="w-5 h-5 fill-current" />
            เริ่มเล่น Spot the Difference
          </button>
        </div>
      ) : (
        <>
          {/* Primary Overview Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-[#111633] border border-amber-500/30 p-5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Trophy className="w-4 h-4" />
                คะแนนสะสมสูงสุด (Best Score)
              </div>
              <div
                data-testid="stats-best-score"
                className="text-3xl font-display font-extrabold text-white mt-2"
              >
                {bestOverallScore.toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl bg-[#111633] border border-cyan-500/30 p-5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <Star className="w-4 h-4 fill-cyan-400" />
                ดาวสะสมทั้งหมด (Total Stars)
              </div>
              <div
                data-testid="stats-total-stars"
                className="text-3xl font-display font-extrabold text-white mt-2"
              >
                {totalStars} <span className="text-base text-slate-400 font-normal">/ 72</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#111633] border border-emerald-500/30 p-5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                ด่านที่ผ่านแล้ว (Levels Completed)
              </div>
              <div
                data-testid="stats-levels-completed"
                className="text-3xl font-display font-extrabold text-white mt-2"
              >
                {completedLevelsCount}{' '}
                <span className="text-base text-slate-400 font-normal">/ 24</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#111633] border border-purple-500/30 p-5">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
                <Gamepad2 className="w-4 h-4" />
                จำนวนรอบที่เล่น (Games Played)
              </div>
              <div
                data-testid="stats-games-played"
                className="text-3xl font-display font-extrabold text-white mt-2"
              >
                {stats.totalGamesPlayed}
              </div>
            </div>
          </div>

          {/* Secondary Personal Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#0E132B] border border-slate-800 p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-300">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">จุดแตกต่างที่ค้นพบทั้งหมด</div>
                <div className="text-xl font-display font-bold text-white">
                  {stats.totalDifferencesFound} จุด
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0E132B] border border-slate-800 p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-pink-500/15 text-pink-300">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">คอมโบสูงสุดที่ทำได้</div>
                <div className="text-xl font-display font-bold text-white">
                  x{stats.highestCombo}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0E132B] border border-slate-800 p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/15 text-amber-300">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">เวลาเล่นสะสมทั้งหมด</div>
                <div className="text-xl font-display font-bold text-white">
                  {Math.max(1, Math.ceil(stats.totalPlayTimeSec / 60))} นาที ({stats.totalPlayTimeSec} วินาที)
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="rounded-2xl bg-[#111633] border border-indigo-500/25 p-6 space-y-4">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              เหรียญรางวัลความสำเร็จ (Achievements)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl border ${
                    ach.unlocked
                      ? 'bg-[#0B0F26] border-amber-400/50 text-white'
                      : 'bg-[#0B0F26]/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="font-display font-bold text-sm flex items-center justify-between">
                    <span>{ach.title}</span>
                    {ach.unlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs mt-1 text-slate-400">{ach.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Level Score Breakdown */}
          <div className="rounded-2xl bg-[#111633] border border-indigo-500/25 p-6 space-y-4">
            <h2 className="text-lg font-display font-bold text-white">
              สถิติรายด่าน — จับผิดภาพ (Spot the Difference)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {SPOT_LEVELS.map((lvl) => {
                const prog = spotTheDifference.levels[lvl.id];
                return (
                  <div
                    key={lvl.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                      prog?.completed
                        ? 'bg-[#0B0F26] border-emerald-500/30 text-slate-200'
                        : 'bg-[#0B0F26]/40 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="font-display font-bold text-sm text-white">
                        ด่าน {lvl.id}: {lvl.titleTh}
                      </div>
                      <div className="mt-1">
                        คะแนนสูงสุด:{' '}
                        <strong className="text-amber-300">
                          {prog && prog.bestScore > 0
                            ? prog.bestScore.toLocaleString()
                            : '-'}
                        </strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            prog && s <= prog.stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
