import React from 'react';
import {
  Play,
  Sparkles,
  Trophy,
  Clock,
  Lock,
  Star,
  History,
  Flame,
} from 'lucide-react';
import type { ArcadeStorageSchemaV1, GameId } from '../types/arcade';
import { GAME_REGISTRY, getGameById } from '../games/registry/gameRegistry';
import { GameCoverArt } from './GameCoverArt';
import { soundService } from '../services/soundService';

interface ArcadeHomeProps {
  storageData: ArcadeStorageSchemaV1;
  onPlayGame: (gameId: GameId) => void;
}

export const ArcadeHome: React.FC<ArcadeHomeProps> = ({
  storageData,
  onPlayGame,
}) => {
  const featuredGame = GAME_REGISTRY[0];
  const lastPlayedGame = storageData.lastPlayedGameId
    ? getGameById(storageData.lastPlayedGameId)
    : undefined;

  const spotSummary = storageData.gameSummaries['spot-the-difference'];
  const spotLevels = Object.values(storageData.spotTheDifference.levels);
  const completedSpotLevels = spotLevels.filter((l) => l.completed).length;
  const totalSpotStars = spotLevels.reduce((acc, l) => acc + l.stars, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#151B40] via-[#1C1447] to-[#0D273D] border-2 border-purple-500/35 shadow-neon-purple p-6 sm:p-10">
        {/* Decorative Neon Glow Orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Welcome & Daily Featured CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-display font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>เกมแนะนำประจำวัน • DAILY FEATURED ARCADE</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight">
                พักแป๊บ เกมเพลิน{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  เติมพลังสมองระหว่างวัน
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                ยินดีต้อนรับสู่ <strong>BreakTime Arcade</strong> ศูนย์รวมมินิเกมอาร์เคดที่เปิดเล่นได้ทันทีไม่ต้องล็อกอิน ไม่มีโฆษณาคั่น พร้อมระบบหยุดเวลาอัตโนมัติเมื่อคุณสลับแท็บกลับไปทำงาน
              </p>
            </div>

            {/* Featured Game Highlight Box */}
            <div className="p-4 rounded-2xl bg-[#0B0F26]/80 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    FEATURED #01
                  </span>
                  <span className="text-xs text-slate-400">• {featuredGame.category}</span>
                </div>
                <h2 className="text-xl font-display font-bold text-white mt-0.5">
                  {featuredGame.titleTh} ({featuredGame.titleEn})
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  24 ด่านภาพวาดการ์ตูนต้นฉบับ • เลือกได้ทั้งโหมดพักสมองและโหมดท้าทายเวลา
                </p>
              </div>

              <button
                type="button"
                data-testid="hero-play-now-btn"
                onClick={() => {
                  soundService.playClick();
                  onPlayGame('spot-the-difference');
                }}
                className="shrink-0 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-display font-bold text-base shadow-neon-cyan transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                เล่นเลย
              </button>
            </div>

            {/* Recently Played Status Strip */}
            <div
              data-testid="recently-played-banner"
              className="flex flex-wrap items-center gap-4 pt-1 text-xs sm:text-sm text-slate-300"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0F26]/70 border border-slate-700/70">
                <History className="w-4 h-4 text-purple-400" />
                <span>เกมที่เล่นล่าสุด:</span>
                {lastPlayedGame ? (
                  <button
                    type="button"
                    onClick={() => onPlayGame(lastPlayedGame.id)}
                    className="font-display font-bold text-cyan-300 hover:underline"
                  >
                    {lastPlayedGame.titleTh} ({lastPlayedGame.titleEn})
                  </button>
                ) : (
                  <span className="text-slate-400">ยังไม่มีประวัติการเล่น เริ่มเกมแรกได้เลย!</span>
                )}
              </div>

              {completedSpotLevels > 0 && (
                <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#0B0F26]/70 border border-amber-500/30">
                  <span className="inline-flex items-center gap-1 text-amber-300 font-display font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {totalSpotStars} ดาว
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-300 font-display font-semibold">
                    ผ่านแล้ว {completedSpotLevels}/24 ด่าน
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Featured Game Artwork Preview Card */}
          <div className="lg:col-span-5">
            <div
              onClick={() => {
                soundService.playClick();
                onPlayGame('spot-the-difference');
              }}
              className="group cursor-pointer rounded-3xl bg-[#0B0F26] border-2 border-cyan-400/40 hover:border-cyan-300 p-3 shadow-neon-cyan transition transform hover:-translate-y-1"
            >
              <div className="rounded-2xl overflow-hidden relative">
                <GameCoverArt gameId="spot-the-difference" className="w-full h-52 sm:h-60 object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-display font-bold text-xs flex items-center gap-1 shadow">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  พร้อมเล่น 24 ด่าน
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-white text-lg">
                    Spot the Difference — จับผิดภาพ
                  </div>
                  <div className="text-xs text-slate-400">
                    ใช้เวลาเล่นต่อรอบประมาณ {featuredGame.estimatedMinutes}
                  </div>
                </div>
                {spotSummary && spotSummary.bestScore > 0 && (
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">คะแนนสูงสุด</span>
                    <span className="font-display font-bold text-amber-300 text-base">
                      {spotSummary.bestScore.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Games Arcade Collection Grid */}
      <section className="space-y-5" aria-labelledby="collection-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="collection-heading"
              className="text-2xl sm:text-3xl font-display font-extrabold text-white"
            >
              คลังเกมอาร์เคด (Arcade Game Collection)
            </h2>
            <p className="text-slate-400 text-sm">
              รวม 10 มินิเกมสุดเพลินสำหรับช่วงเวลาพักเบรก • เปิดตัวเกมแรกให้เล่นเต็มรูปแบบแล้ววันนี้!
            </p>
          </div>
          <div className="text-xs text-slate-400 font-display">
            พร้อมเล่น <span className="text-emerald-400 font-bold">1 เกม</span> • เร็ว ๆ นี้{' '}
            <span className="text-purple-400 font-bold">9 เกม</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {GAME_REGISTRY.map((game) => {
            const isPlayable = game.status === 'playable';
            const summary = storageData.gameSummaries[game.id];
            const hasBestScore = summary && summary.bestScore > 0;

            return (
              <article
                key={game.id}
                data-testid={`game-card-${game.id}`}
                className={`flex flex-col justify-between rounded-2xl overflow-hidden border transition ${
                  isPlayable
                    ? 'bg-[#111633] border-cyan-400/50 hover:border-cyan-300 shadow-neon-cyan'
                    : 'bg-[#0E132B]/90 border-slate-800/90 opacity-90'
                }`}
              >
                <div>
                  {/* Cover Art Header */}
                  <div className="relative overflow-hidden bg-[#080B1A]">
                    <GameCoverArt gameId={game.id} className="w-full h-40" />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-[#080B1A]/85 border border-slate-700 text-xs font-display font-bold text-slate-200">
                      #{String(game.number).padStart(2, '0')}
                    </div>
                    <div className="absolute top-3 right-3">
                      {isPlayable ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-display font-bold text-xs shadow">
                          พร้อมเล่น
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-purple-300 border border-purple-500/40 font-display font-semibold text-xs">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-cyan-300/90 font-medium">
                      <span>{game.category}</span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {game.estimatedMinutes}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {game.titleTh}
                      </h3>
                      <div className="text-xs font-medium text-slate-400">
                        {game.titleEn}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Best Score & Play Button */}
                <div className="p-4 pt-0 space-y-3">
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 inline-flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      สถิติสูงสุด:
                    </span>
                    {hasBestScore ? (
                      <span
                        data-testid={`game-best-score-${game.id}`}
                        className="font-display font-bold text-amber-300"
                      >
                        {summary.bestScore.toLocaleString()} คะแนน
                      </span>
                    ) : (
                      <span className="text-slate-500">ยังไม่มีสถิติ</span>
                    )}
                  </div>

                  <button
                    type="button"
                    data-testid={`play-game-btn-${game.id}`}
                    disabled={!isPlayable}
                    onClick={() => {
                      if (!isPlayable) return;
                      soundService.playClick();
                      onPlayGame(game.id);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition ${
                      isPlayable
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-md cursor-pointer'
                        : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                    }`}
                  >
                    {isPlayable ? (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        เล่นเลย
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        เร็ว ๆ นี้ (Coming Soon)
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
