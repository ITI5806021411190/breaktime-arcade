import React, { useRef } from 'react';
import type {
  DifferenceMetadata,
  SceneObject,
  SceneThemeId,
} from '../../../types/spot';
import {
  SceneObjectRenderer,
  SceneThemeBackground,
} from '../scenes/SceneArtworkRenderer';

export interface FloatingFeedback {
  id: string;
  x: number; // 0..100
  y: number; // 0..100
  type: 'correct' | 'wrong' | 'already';
  text: string;
}

interface SceneCanvasProps {
  side: 'left' | 'right';
  labelTh: string;
  theme: SceneThemeId;
  objects: SceneObject[];
  differences: DifferenceMetadata[];
  solvedIds: ReadonlySet<string>;
  activeHintId: string | null;
  feedbacks: FloatingFeedback[];
  zoom: number;
  disabled?: boolean;
  onNormalizedClick: (normX: number, normY: number, side: 'left' | 'right') => void;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  side,
  labelTh,
  theme,
  objects,
  differences,
  solvedIds,
  activeHintId,
  feedbacks,
  zoom,
  disabled = false,
  onNormalizedClick,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (disabled) return;

    const svgEl = svgRef.current;
    if (!svgEl) return;

    const rect = svgEl.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width : 1000;
    const height = rect.height > 0 ? rect.height : 750;

    const normX = ((e.clientX - rect.left) / width) * 100;
    const normY = ((e.clientY - rect.top) / height) * 100;

    const clampedX = Math.max(0, Math.min(100, normX));
    const clampedY = Math.max(0, Math.min(100, normY));

    onNormalizedClick(clampedX, clampedY, side);
  };

  const solvedList = differences.filter((d) => solvedIds.has(d.id));
  const hintedDiff = activeHintId
    ? differences.find((d) => d.id === activeHintId && !solvedIds.has(d.id))
    : undefined;

  return (
    <div className="relative flex flex-col rounded-2xl bg-[#111633] border-2 border-indigo-500/30 shadow-neon-purple overflow-hidden select-none">
      {/* Top Bar Badge */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0B0F26]/90 border-b border-indigo-500/20 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-2 font-display font-semibold text-slate-200">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              side === 'left'
                ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                : 'bg-pink-400 shadow-[0_0_8px_#f472b6]'
            }`}
          />
          {labelTh}
        </span>
        <span className="text-[11px] text-slate-400">คลิกหรือแตะจุดที่ต่างกัน</span>
      </div>

      {/* Scrollable/Zoomable Viewport Container */}
      <div className="relative w-full overflow-auto bg-[#080B1A] touch-manipulation">
        <div
          style={{
            width: `${zoom * 100}%`,
            transition: 'width 0.2s ease-out',
          }}
          className="mx-auto"
        >
          <svg
            ref={svgRef}
            data-testid={`scene-canvas-${side}`}
            viewBox="0 0 1000 750"
            preserveAspectRatio="xMidYMid meet"
            onClick={handleClick}
            className={`w-full h-auto block touch-manipulation ${
              disabled ? 'cursor-not-allowed opacity-70' : 'cursor-crosshair'
            }`}
          >
            {/* 1. Theme Illustrated Background */}
            <SceneThemeBackground theme={theme} />

            {/* 2. Scene Objects */}
            {objects.map((obj) => (
              <SceneObjectRenderer key={obj.id} obj={obj} />
            ))}

            {/* 3. Active Hint Ring (if user clicked Hint and hasn't solved it yet) */}
            {hintedDiff && (
              <g
                data-testid={`hint-ring-${side}-${hintedDiff.id}`}
                transform={`translate(${hintedDiff.position.x * 10}, ${
                  hintedDiff.position.y * 7.5
                })`}
                className="pointer-events-none"
              >
                <circle
                  cx="0"
                  cy="0"
                  r={hintedDiff.hitbox.radius * 8.5}
                  fill="rgba(250, 204, 21, 0.16)"
                  stroke="#FACC15"
                  strokeWidth="6"
                  strokeDasharray="14 8"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={hintedDiff.hitbox.radius * 10.5}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  className="animate-pulse-ring"
                />
              </g>
            )}

            {/* 4. Solved Difference Highlights on BOTH images */}
            {solvedList.map((diff, idx) => {
              const cx = diff.position.x * 10;
              const cy = diff.position.y * 7.5;
              const r = Math.max(44, diff.hitbox.radius * 6.8);
              return (
                <g
                  key={diff.id}
                  data-testid={`solved-ring-${side}-${diff.id}`}
                  transform={`translate(${cx}, ${cy})`}
                  className="pointer-events-none"
                >
                  <circle
                    cx="0"
                    cy="0"
                    r={r + 5}
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="9"
                    opacity="0.65"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r={r}
                    fill="rgba(16, 185, 129, 0.14)"
                    stroke="#10B981"
                    strokeWidth="6"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r={r - 7}
                    fill="none"
                    stroke="#A7F3D0"
                    strokeWidth="2.5"
                    strokeDasharray="10 6"
                  />
                  {/* Badge number */}
                  <g transform={`translate(${r * 0.68}, ${-r * 0.68})`}>
                    <circle cx="0" cy="0" r="16" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="15"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* 5. Temporary Floating Feedback (Wrong click ripple or +Score popup) */}
            {feedbacks.map((fb) => {
              const fx = fb.x * 10;
              const fy = fb.y * 7.5;
              if (fb.type === 'wrong') {
                return (
                  <g
                    key={fb.id}
                    transform={`translate(${fx}, ${fy})`}
                    className="pointer-events-none animate-shake-gentle"
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="28"
                      fill="rgba(244, 63, 94, 0.2)"
                      stroke="#F43F5E"
                      strokeWidth="4"
                    />
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
                    <line x1="10" y1="-10" x2="-10" y2="10" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
                  </g>
                );
              }

              return (
                <g
                  key={fb.id}
                  transform={`translate(${fx}, ${fy - 25})`}
                  className="pointer-events-none animate-float-up"
                >
                  <rect
                    x="-65"
                    y="-22"
                    width="130"
                    height="34"
                    rx="17"
                    fill={fb.type === 'correct' ? '#059669' : '#334155'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fill="#FEF08A"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    {fb.text}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
