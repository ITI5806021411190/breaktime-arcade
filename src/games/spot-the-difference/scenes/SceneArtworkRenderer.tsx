import React from 'react';
import type { SceneObject, SceneThemeId } from '../../../types/spot';

interface SceneBackgroundProps {
  theme: SceneThemeId;
}

export const SceneThemeBackground: React.FC<SceneBackgroundProps> = ({ theme }) => {
  switch (theme) {
    case 'front-garden':
      return (
        <g>
          <defs>
            <linearGradient id="bg-garden-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="65%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="bg-garden-lawn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="750" fill="url(#bg-garden-sky)" />
          {/* Distant hills */}
          <path d="M0 460 Q250 370 520 450 T1000 430 L1000 750 L0 750 Z" fill="#86EFAC" />
          {/* Picket fence */}
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={i} transform={`translate(${i * 52 + 8}, 390)`}>
              <path d="M0 20 L18 0 L36 20 L36 95 L0 95 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
            </g>
          ))}
          <rect x="0" y="425" width="1000" height="12" fill="#E2E8F0" />
          <rect x="0" y="460" width="1000" height="12" fill="#E2E8F0" />
          {/* Main lawn */}
          <path d="M0 475 Q500 455 1000 475 L1000 750 L0 750 Z" fill="url(#bg-garden-lawn)" />
          {/* Stone path */}
          <path d="M430 475 L570 475 L690 750 L310 750 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
          <ellipse cx="500" cy="540" rx="55" ry="16" fill="#CBD5E1" />
          <ellipse cx="485" cy="610" rx="68" ry="20" fill="#CBD5E1" />
          <ellipse cx="515" cy="690" rx="82" ry="24" fill="#CBD5E1" />
        </g>
      );

    case 'street-cafe':
      return (
        <g>
          <defs>
            <linearGradient id="bg-cafe-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="55%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="750" fill="url(#bg-cafe-sky)" />
          {/* European town silhouette */}
          <rect x="40" y="180" width="260" height="340" fill="#FDE68A" stroke="#F59E0B" strokeWidth="3" />
          <rect x="680" y="160" width="280" height="360" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
          {/* Sidewalk & street */}
          <rect x="0" y="490" width="1000" height="110" fill="#E7E5E4" />
          <line x1="0" y1="490" x2="1000" y2="490" stroke="#A8A29E" strokeWidth="5" />
          <rect x="0" y="600" width="1000" height="150" fill="#57534E" />
          <line x1="0" y1="600" x2="1000" y2="600" stroke="#D6D3D1" strokeWidth="8" />
          {/* String lights across top */}
          <path d="M0 90 Q500 175 1000 85" fill="none" stroke="#44403C" strokeWidth="3" />
          {Array.from({ length: 11 }).map((_, i) => (
            <circle
              key={i}
              cx={90 + i * 82}
              cy={110 + Math.sin((i / 10) * Math.PI) * 35}
              r="9"
              fill="#FEF08A"
              stroke="#CA8A04"
              strokeWidth="2"
            />
          ))}
        </g>
      );

    case 'sunny-beach':
      return (
        <g>
          <defs>
            <linearGradient id="bg-beach-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
            <linearGradient id="bg-beach-sand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="400" fill="url(#bg-beach-sky)" />
          {/* Distant tropical island */}
          <path d="M680 350 Q780 260 900 350 Z" fill="#15803D" />
          {/* Ocean */}
          <rect x="0" y="340" width="1000" height="145" fill="#06B6D4" />
          <path d="M0 390 Q250 375 500 390 T1000 390" fill="none" stroke="#A5F3FC" strokeWidth="5" />
          <path d="M0 445 Q250 430 500 445 T1000 445" fill="none" stroke="#CFFAFE" strokeWidth="6" />
          {/* Sandy beach */}
          <path d="M0 470 Q450 440 1000 480 L1000 750 L0 750 Z" fill="url(#bg-beach-sand)" />
          <path d="M0 475 Q450 445 1000 485" fill="none" stroke="#FEF9C3" strokeWidth="10" opacity="0.8" />
        </g>
      );

    case 'cozy-office':
      return (
        <g>
          {/* Interior studio wall */}
          <rect x="0" y="0" width="1000" height="520" fill="#DBEAFE" />
          {/* Subtle wallpaper stripes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={i * 90} y="0" width="45" height="520" fill="#EFF6FF" opacity="0.45" />
          ))}
          {/* Baseboard */}
          <rect x="0" y="500" width="1000" height="24" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
          {/* Wooden floor */}
          <rect x="0" y="524" width="1000" height="226" fill="#D97706" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={524 + i * 38}
              x2="1000"
              y2={524 + i * 38}
              stroke="#B45309"
              strokeWidth="2"
            />
          ))}
          {/* Cozy center rug */}
          <ellipse cx="500" cy="655" rx="340" ry="65" fill="#7C3AED" stroke="#DDD6FE" strokeWidth="8" />
          <ellipse cx="500" cy="655" rx="280" ry="45" fill="#8B5CF6" />
        </g>
      );

    case 'night-market':
      return (
        <g>
          <defs>
            <linearGradient id="bg-night-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="65%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="500" fill="url(#bg-night-sky)" />
          {/* Stars */}
          {Array.from({ length: 18 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 137 + 40) % 960}
              cy={(i * 67 + 25) % 240}
              r={i % 3 === 0 ? 3.5 : 2}
              fill="#FEF08A"
              opacity="0.8"
            />
          ))}
          {/* Festival flags */}
          <path d="M0 110 Q500 190 1000 105" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
          {Array.from({ length: 14 }).map((_, i) => {
            const fx = 55 + i * 66;
            const fy = 115 + Math.sin((i / 13) * Math.PI) * 38;
            const flagColors = ['#F43F5E', '#38BDF8', '#FACC15', '#4ADE80', '#A855F7'];
            return (
              <polygon
                key={i}
                points={`${fx - 14},${fy} ${fx + 14},${fy} ${fx},${fy + 28}`}
                fill={flagColors[i % flagColors.length]}
              />
            );
          })}
          {/* Market ground */}
          <rect x="0" y="490" width="1000" height="260" fill="#1E293B" />
          <line x1="0" y1="490" x2="1000" y2="490" stroke="#F472B6" strokeWidth="4" />
        </g>
      );

    case 'animal-farm':
      return (
        <g>
          <defs>
            <linearGradient id="bg-farm-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="450" fill="url(#bg-farm-sky)" />
          {/* Rolling pasture hills */}
          <path d="M0 420 Q300 320 620 410 T1000 380 L1000 750 L0 750 Z" fill="#84CC16" />
          <path d="M0 470 Q450 420 1000 475 L1000 750 L0 750 Z" fill="#65A30D" />
          {/* Wooden farm rail fence */}
          {Array.from({ length: 11 }).map((_, i) => (
            <rect key={i} x={30 + i * 92} y="410" width="14" height="75" fill="#92400E" rx="3" />
          ))}
          <rect x="0" y="430" width="1000" height="10" fill="#B45309" />
          <rect x="0" y="458" width="1000" height="10" fill="#B45309" />
          {/* Dirt farm road */}
          <path d="M380 480 L620 480 L760 750 L240 750 Z" fill="#D97706" opacity="0.65" />
        </g>
      );

    case 'amusement-park':
      return (
        <g>
          <defs>
            <linearGradient id="bg-park-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="55%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="490" fill="url(#bg-park-sky)" />
          {/* Roller coaster silhouette loop */}
          <path
            d="M0 440 Q140 430 220 320 C280 210 400 210 450 320 Q530 450 700 360 T1000 410"
            fill="none"
            stroke="#F43F5E"
            strokeWidth="7"
            opacity="0.55"
          />
          <rect x="0" y="485" width="1000" height="265" fill="#334155" />
          <rect x="0" y="485" width="1000" height="18" fill="#FBBF24" />
        </g>
      );

    case 'future-city':
      return (
        <g>
          <defs>
            <linearGradient id="bg-cyber-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#090D16" />
              <stop offset="60%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1000" height="490" fill="url(#bg-cyber-sky)" />
          {/* Distant sci-fi skyline */}
          <rect x="50" y="210" width="90" height="280" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <rect x="170" y="260" width="75" height="230" fill="#0F172A" stroke="#A855F7" strokeWidth="2" />
          <rect x="760" y="190" width="110" height="300" fill="#1E293B" stroke="#EC4899" strokeWidth="2" />
          {/* Neon Grid Floor */}
          <rect x="0" y="490" width="1000" height="260" fill="#0F172A" />
          <line x1="0" y1="490" x2="1000" y2="490" stroke="#22D3EE" strokeWidth="5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={530 + i * 50}
              x2="1000"
              y2={530 + i * 50}
              stroke="#06B6D4"
              strokeWidth="1.5"
              opacity="0.35"
            />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1={100 + i * 100}
              y1="490"
              x2={-100 + i * 150}
              y2="750"
              stroke="#A855F7"
              strokeWidth="1.5"
              opacity="0.35"
            />
          ))}
        </g>
      );
  }
};

interface SceneObjectRendererProps {
  obj: SceneObject;
}

export const SceneObjectRenderer: React.FC<SceneObjectRendererProps> = ({ obj }) => {
  const cx = obj.x * 10;
  const cy = obj.y * 7.5;
  const w = obj.width * 10;
  const h = obj.height * 7.5;
  const scale = obj.scale ?? 1;
  const flip = obj.flipX ? -1 : 1;
  const rot = obj.rotation ?? 0;

  const secondary = obj.secondaryColor ?? '#F8FAFC';
  const accent = obj.accentColor ?? '#FACC15';
  const variant = obj.variant ?? 'default';
  const detail = obj.detail ?? 'plain';

  const transform = `translate(${cx}, ${cy}) scale(${scale * flip}, ${scale}) rotate(${rot})`;

  switch (obj.shape) {
    case 'sun-moon': {
      return (
        <g transform={transform}>
          {variant === 'crescent' ? (
            <g>
              <circle cx="0" cy="0" r={w * 0.45} fill={obj.color} />
              <circle cx={w * 0.18} cy={-w * 0.1} r={w * 0.36} fill="#1E1B4B" />
            </g>
          ) : variant === 'planet' ? (
            <g>
              <circle cx="0" cy="0" r={w * 0.42} fill={obj.color} stroke={secondary} strokeWidth="3" />
              <ellipse
                cx="0"
                cy="0"
                rx={w * 0.72}
                ry={w * 0.18}
                fill="none"
                stroke={accent}
                strokeWidth="7"
                transform="rotate(-18)"
              />
            </g>
          ) : (
            <g>
              {/* Sun rays */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={-w * 0.48}
                  x2="0"
                  y2={-w * 0.66}
                  stroke={secondary}
                  strokeWidth="6"
                  strokeLinecap="round"
                  transform={`rotate(${i * 45})`}
                />
              ))}
              <circle cx="0" cy="0" r={w * 0.42} fill={obj.color} stroke={secondary} strokeWidth="4" />
              {detail === 'sunglasses' ? (
                <g>
                  <rect x={-w * 0.28} y={-w * 0.12} width={w * 0.24} height={w * 0.16} rx="3" fill="#0F172A" />
                  <rect x={w * 0.04} y={-w * 0.12} width={w * 0.24} height={w * 0.16} rx="3" fill="#0F172A" />
                  <line x1={-w * 0.04} y1={-w * 0.05} x2={w * 0.04} y2={-w * 0.05} stroke="#0F172A" strokeWidth="3" />
                </g>
              ) : (
                <g>
                  <circle cx={-w * 0.14} cy={-w * 0.06} r="4" fill="#78350F" />
                  <circle cx={w * 0.14} cy={-w * 0.06} r="4" fill="#78350F" />
                </g>
              )}
              <path d={`M${-w * 0.14} ${w * 0.1} Q0 ${w * 0.22} ${w * 0.14} ${w * 0.1}`} fill="none" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}
        </g>
      );
    }

    case 'cloud': {
      return (
        <g transform={transform}>
          <ellipse cx="0" cy={h * 0.1} rx={w * 0.46} ry={h * 0.28} fill={obj.color} />
          <circle cx={-w * 0.2} cy={-h * 0.05} r={h * 0.32} fill={obj.color} />
          <circle cx={w * 0.08} cy={-h * 0.12} r={h * 0.38} fill={obj.color} />
          <circle cx={w * 0.28} cy={h * 0.02} r={h * 0.26} fill={obj.color} />
          {detail === 'rain' && (
            <g stroke="#38BDF8" strokeWidth="4" strokeLinecap="round">
              <line x1={-w * 0.2} y1={h * 0.42} x2={-w * 0.25} y2={h * 0.62} />
              <line x1="0" y1={h * 0.42} x2={-w * 0.05} y2={h * 0.62} />
              <line x1={w * 0.2} y1={h * 0.42} x2={w * 0.15} y2={h * 0.62} />
            </g>
          )}
          {detail === 'lightning' && (
            <polygon
              points={`0,${h * 0.32} -12,${h * 0.58} 2,${h * 0.58} -6,${h * 0.85} 16,${h * 0.5} 2,${h * 0.5}`}
              fill="#FACC15"
            />
          )}
        </g>
      );
    }

    case 'hot-air-balloon': {
      return (
        <g transform={transform}>
          {/* Basket */}
          <rect x={-w * 0.14} y={h * 0.32} width={w * 0.28} height={h * 0.18} rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <line x1={-w * 0.1} y1={h * 0.18} x2={-w * 0.1} y2={h * 0.32} stroke="#78350F" strokeWidth="2" />
          <line x1={w * 0.1} y1={h * 0.18} x2={w * 0.1} y2={h * 0.32} stroke="#78350F" strokeWidth="2" />
          {/* Envelope */}
          <circle cx="0" cy={-h * 0.12} r={w * 0.42} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <ellipse cx="0" cy={-h * 0.12} rx={w * 0.2} ry={w * 0.42} fill={secondary} stroke="#1E293B" strokeWidth="2.5" />
          {detail === 'star' && (
            <circle cx="0" cy={-h * 0.12} r={w * 0.12} fill={accent} />
          )}
        </g>
      );
    }

    case 'bird': {
      return (
        <g transform={transform}>
          <ellipse cx="0" cy="0" rx={w * 0.34} ry={h * 0.28} fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
          <path d={`M${-w * 0.1} 0 Q0 ${-h * 0.45} ${w * 0.18} 0`} fill={secondary} stroke="#1E293B" strokeWidth="2" />
          <circle cx={w * 0.18} cy={-h * 0.06} r="3.5" fill="#0F172A" />
          <polygon points={`${w * 0.32},-4 ${w * 0.52},2 ${w * 0.32},8`} fill="#F59E0B" />
          {detail === 'crown' && (
            <polygon points="-6,-12 0,-22 6,-12" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
          )}
        </g>
      );
    }

    case 'ufo-drone': {
      return (
        <g transform={transform}>
          <ellipse cx="0" cy={-h * 0.1} rx={w * 0.28} ry={h * 0.26} fill="#67E8F9" opacity="0.85" stroke="#0891B2" strokeWidth="2.5" />
          <ellipse cx="0" cy={h * 0.05} rx={w * 0.5} ry={h * 0.18} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <circle cx={-w * 0.26} cy={h * 0.05} r="5" fill={accent} />
          <circle cx="0" cy={h * 0.05} r="5" fill={secondary} />
          <circle cx={w * 0.26} cy={h * 0.05} r="5" fill={accent} />
          {detail === 'beam' && (
            <polygon
              points={`${-w * 0.18},${h * 0.2} ${w * 0.18},${h * 0.2} ${w * 0.36},${h * 0.65} ${-w * 0.36},${h * 0.65}`}
              fill={accent}
              opacity="0.4"
            />
          )}
        </g>
      );
    }

    case 'house': {
      return (
        <g transform={transform}>
          {/* Chimney */}
          {detail !== 'no-chimney' && (
            <rect x={w * 0.18} y={-h * 0.48} width={w * 0.12} height={h * 0.26} fill="#B91C1C" stroke="#1E293B" strokeWidth="3" />
          )}
          {/* Main wall */}
          <rect x={-w * 0.42} y={-h * 0.12} width={w * 0.84} height={h * 0.62} rx="6" fill={obj.color} stroke="#1E293B" strokeWidth="3.5" />
          {/* Roof */}
          <polygon
            points={`${-w * 0.5},${-h * 0.12} 0,${-h * 0.5} ${w * 0.5},${-h * 0.12}`}
            fill={secondary}
            stroke="#1E293B"
            strokeWidth="3.5"
          />
          {/* Door */}
          <rect x={-w * 0.1} y={h * 0.12} width={w * 0.2} height={h * 0.38} rx="5" fill={accent} stroke="#1E293B" strokeWidth="3" />
          <circle cx={w * 0.05} cy={h * 0.3} r="4" fill="#1E293B" />
          {/* Attic window */}
          {variant === 'star-window' ? (
            <polygon
              points={`0,${-h * 0.38} 8,${-h * 0.24} -8,${-h * 0.24}`}
              fill="#FEF08A"
              stroke="#1E293B"
              strokeWidth="2.5"
            />
          ) : (
            <circle cx="0" cy={-h * 0.28} r={w * 0.09} fill="#BAE6FD" stroke="#1E293B" strokeWidth="3" />
          )}
        </g>
      );
    }

    case 'cafe-shop': {
      return (
        <g transform={transform}>
          {/* Shop Body */}
          <rect x={-w * 0.46} y={-h * 0.42} width={w * 0.92} height={h * 0.9} rx="8" fill={obj.color} stroke="#1E293B" strokeWidth="3.5" />
          {/* Display window */}
          <rect x={-w * 0.36} y={-h * 0.08} width={w * 0.44} height={h * 0.36} rx="6" fill="#BAE6FD" stroke="#1E293B" strokeWidth="3" />
          {/* Shop Door */}
          <rect x={w * 0.14} y={-h * 0.08} width={w * 0.22} height={h * 0.56} rx="4" fill={accent} stroke="#1E293B" strokeWidth="3" />
          {/* Striped Awning */}
          <g transform={`translate(0, ${-h * 0.24})`}>
            {[-3, -2, -1, 0, 1, 2].map((idx) => (
              <rect
                key={idx}
                x={idx * (w * 0.15)}
                y="0"
                width={w * 0.15}
                height={h * 0.18}
                rx="6"
                fill={idx % 2 === 0 ? secondary : '#FFFFFF'}
                stroke="#1E293B"
                strokeWidth="2.5"
              />
            ))}
          </g>
          {/* Roof Sign */}
          <rect x={-w * 0.28} y={-h * 0.54} width={w * 0.56} height={h * 0.14} rx="8" fill={accent} stroke="#1E293B" strokeWidth="3" />
          <circle cx="0" cy={-h * 0.47} r="6" fill={secondary} />
        </g>
      );
    }

    case 'barn': {
      return (
        <g transform={transform}>
          <rect x={-w * 0.44} y={-h * 0.15} width={w * 0.88} height={h * 0.65} fill={obj.color} stroke="#1E293B" strokeWidth="3.5" />
          <polygon
            points={`${-w * 0.5},${-h * 0.15} ${-w * 0.28},${-h * 0.48} ${w * 0.28},${-h * 0.48} ${w * 0.5},${-h * 0.15}`}
            fill={secondary}
            stroke="#1E293B"
            strokeWidth="3.5"
          />
          {/* Barn Double Door with X */}
          <rect x={-w * 0.22} y={h * 0.08} width={w * 0.44} height={h * 0.42} fill={accent} stroke="#FFFFFF" strokeWidth="4" />
          <line x1={-w * 0.22} y1={h * 0.08} x2={w * 0.22} y2={h * 0.5} stroke="#FFFFFF" strokeWidth="4" />
          <line x1={w * 0.22} y1={h * 0.08} x2={-w * 0.22} y2={h * 0.5} stroke="#FFFFFF" strokeWidth="4" />
          {/* Hayloft Window */}
          <rect x={-w * 0.1} y={-h * 0.34} width={w * 0.2} height={h * 0.16} fill="#FEF08A" stroke="#FFFFFF" strokeWidth="3" />
        </g>
      );
    }

    case 'market-stall': {
      return (
        <g transform={transform}>
          {/* Poles */}
          <rect x={-w * 0.4} y={-h * 0.3} width="8" height={h * 0.75} fill="#78350F" />
          <rect x={w * 0.4 - 8} y={-h * 0.3} width="8" height={h * 0.75} fill="#78350F" />
          {/* Counter */}
          <rect x={-w * 0.44} y={h * 0.1} width={w * 0.88} height={h * 0.36} rx="6" fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {/* Canopy */}
          <polygon
            points={`${-w * 0.48},${-h * 0.18} ${-w * 0.36},${-h * 0.42} ${w * 0.36},${-h * 0.42} ${w * 0.48},${-h * 0.18}`}
            fill={secondary}
            stroke="#1E293B"
            strokeWidth="3"
          />
          {/* Hanging lanterns */}
          <circle cx={-w * 0.24} cy={-h * 0.1} r="10" fill={accent} stroke="#1E293B" strokeWidth="2" />
          <circle cx="0" cy={-h * 0.1} r="10" fill={accent} stroke="#1E293B" strokeWidth="2" />
          <circle cx={w * 0.24} cy={-h * 0.1} r="10" fill={accent} stroke="#1E293B" strokeWidth="2" />
        </g>
      );
    }

    case 'ferris-wheel': {
      return (
        <g transform={transform}>
          {/* Support legs */}
          <line x1="0" y1="0" x2={-w * 0.32} y2={h * 0.5} stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
          <line x1="0" y1="0" x2={w * 0.32} y2={h * 0.5} stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
          {/* Wheel rim */}
          <circle cx="0" cy="0" r={w * 0.4} fill="none" stroke={obj.color} strokeWidth="6" />
          <circle cx="0" cy="0" r={w * 0.26} fill="none" stroke={secondary} strokeWidth="3" />
          {/* Spokes & Cabins */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * Math.PI) / 3;
            const gx = Math.cos(angle) * (w * 0.4);
            const gy = Math.sin(angle) * (w * 0.4);
            return (
              <g key={i}>
                <line x1="0" y1="0" x2={gx} y2={gy} stroke="#E2E8F0" strokeWidth="2.5" />
                <circle cx={gx} cy={gy} r="11" fill={i % 2 === 0 ? accent : secondary} stroke="#1E293B" strokeWidth="2.5" />
              </g>
            );
          })}
          {/* Center Hub */}
          <circle cx="0" cy="0" r="14" fill={accent} stroke="#1E293B" strokeWidth="3" />
        </g>
      );
    }

    case 'skyscraper': {
      return (
        <g transform={transform}>
          {/* Antenna */}
          <line x1="0" y1={-h * 0.45} x2="0" y2={-h * 0.62} stroke={accent} strokeWidth="5" />
          <circle cx="0" cy={-h * 0.64} r="7" fill={accent} />
          {/* Main Tower */}
          <rect x={-w * 0.36} y={-h * 0.45} width={w * 0.72} height={h * 0.92} rx="6" fill={obj.color} stroke={secondary} strokeWidth="3.5" />
          {/* Neon Window Grid */}
          {[-0.28, -0.1, 0.08, 0.26].map((wy, rIdx) => (
            <rect
              key={rIdx}
              x={-w * 0.24}
              y={h * wy}
              width={w * 0.48}
              height={h * 0.09}
              rx="3"
              fill={rIdx % 2 === 0 ? secondary : accent}
            />
          ))}
        </g>
      );
    }

    case 'tree': {
      return (
        <g transform={transform}>
          {/* Trunk */}
          <rect x={-w * 0.1} y={h * 0.05} width={w * 0.2} height={h * 0.44} rx="4" fill="#92400E" stroke="#1E293B" strokeWidth="3" />
          {/* Canopy */}
          <circle cx="0" cy={-h * 0.18} r={w * 0.36} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <circle cx={-w * 0.22} cy={-h * 0.02} r={w * 0.26} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <circle cx={w * 0.22} cy={-h * 0.02} r={w * 0.26} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <circle cx="0" cy={-h * 0.06} r={w * 0.3} fill={secondary} />
          {/* Fruits / Flowers detail */}
          {detail === 'apples' && (
            <g fill={accent} stroke="#1E293B" strokeWidth="2">
              <circle cx={-w * 0.14} cy={-h * 0.14} r="7.5" />
              <circle cx={w * 0.16} cy={-h * 0.08} r="7.5" />
              <circle cx="0" cy={-h * 0.26} r="7.5" />
            </g>
          )}
        </g>
      );
    }

    case 'palm-tree': {
      return (
        <g transform={transform}>
          {/* Curved Trunk */}
          <path
            d={`M0 ${h * 0.48} Q${-w * 0.12} ${h * 0.1} ${w * 0.05} ${-h * 0.22}`}
            fill="none"
            stroke="#B45309"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Palm Fronds */}
          <g transform={`translate(${w * 0.05}, ${-h * 0.24})`}>
            <path d={`M0 0 Q${-w * 0.45} ${-h * 0.18} ${-w * 0.55} ${h * 0.08}`} fill="none" stroke={obj.color} strokeWidth="14" strokeLinecap="round" />
            <path d={`M0 0 Q${w * 0.45} ${-h * 0.18} ${w * 0.55} ${h * 0.08}`} fill="none" stroke={obj.color} strokeWidth="14" strokeLinecap="round" />
            <path d={`M0 0 Q0 ${-h * 0.38} ${w * 0.3} ${-h * 0.28}`} fill="none" stroke={secondary} strokeWidth="12" strokeLinecap="round" />
            {detail === 'coconuts' && (
              <g fill="#78350F" stroke="#1E293B" strokeWidth="2">
                <circle cx="-8" cy="8" r="8" />
                <circle cx="8" cy="8" r="8" />
              </g>
            )}
          </g>
        </g>
      );
    }

    case 'flower-pot': {
      return (
        <g transform={transform}>
          {/* Stem & Flower */}
          <line x1="0" y1={h * 0.05} x2="0" y2={-h * 0.26} stroke="#16A34A" strokeWidth="6" />
          <circle cx={-10} cy={-h * 0.26} r="9" fill={secondary} />
          <circle cx={10} cy={-h * 0.26} r="9" fill={secondary} />
          <circle cx="0" cy={-h * 0.26 - 10} r="9" fill={secondary} />
          <circle cx="0" cy={-h * 0.26 + 10} r="9" fill={secondary} />
          <circle cx="0" cy={-h * 0.26} r="7" fill={accent} />
          {/* Pot */}
          <polygon
            points={`${-w * 0.32},${h * 0.02} ${w * 0.32},${h * 0.02} ${w * 0.22},${h * 0.44} ${-w * 0.22},${h * 0.44}`}
            fill={obj.color}
            stroke="#1E293B"
            strokeWidth="3"
          />
        </g>
      );
    }

    case 'bush': {
      return (
        <g transform={transform}>
          <ellipse cx="0" cy={h * 0.1} rx={w * 0.46} ry={h * 0.34} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <circle cx={-w * 0.22} cy="0" r={h * 0.28} fill={obj.color} />
          <circle cx={w * 0.22} cy="0" r={h * 0.28} fill={obj.color} />
          <circle cx="0" cy={-h * 0.08} r={h * 0.32} fill={secondary} />
          {detail === 'berries' && (
            <g fill={accent}>
              <circle cx={-w * 0.18} cy={h * 0.04} r="5.5" />
              <circle cx={w * 0.16} cy={h * 0.06} r="5.5" />
              <circle cx="0" cy={-h * 0.1} r="5.5" />
            </g>
          )}
        </g>
      );
    }

    case 'window': {
      return (
        <g transform={transform}>
          <rect
            x={-w * 0.42}
            y={-h * 0.42}
            width={w * 0.84}
            height={h * 0.84}
            rx={variant === 'arch' ? 24 : 6}
            fill={obj.color}
            stroke={secondary}
            strokeWidth="5"
          />
          <line x1="0" y1={-h * 0.42} x2="0" y2={h * 0.42} stroke={secondary} strokeWidth="4" />
          <line x1={-w * 0.42} y1="0" x2={w * 0.42} y2="0" stroke={secondary} strokeWidth="4" />
          {detail === 'curtain' && (
            <path
              d={`M${-w * 0.38} ${-h * 0.38} L0 ${-h * 0.38} Q${-w * 0.1} 0 ${-w * 0.38} ${h * 0.2} Z`}
              fill={accent}
            />
          )}
        </g>
      );
    }

    case 'cat': {
      return (
        <g transform={transform}>
          {/* Tail */}
          <path
            d={`M${w * 0.2} ${h * 0.28} Q${w * 0.48} ${h * 0.1} ${w * 0.42} ${-h * 0.18}`}
            fill="none"
            stroke={obj.color}
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Body */}
          <ellipse cx="0" cy={h * 0.16} rx={w * 0.26} ry={h * 0.28} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {/* Head */}
          <circle cx="0" cy={-h * 0.16} r={w * 0.24} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {/* Ears */}
          <polygon points={`${-w * 0.22},${-h * 0.28} ${-w * 0.16},${-h * 0.5} ${-w * 0.04},${-h * 0.34}`} fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
          <polygon points={`${w * 0.22},${-h * 0.28} ${w * 0.16},${-h * 0.5} ${w * 0.04},${-h * 0.34}`} fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
          {/* Eyes & Nose */}
          <circle cx={-w * 0.08} cy={-h * 0.18} r="3.5" fill="#0F172A" />
          <circle cx={w * 0.08} cy={-h * 0.18} r="3.5" fill="#0F172A" />
          <polygon points="-4,-6 4,-6 0,-1" fill="#F43F5E" />
          {/* Collar */}
          <rect x={-w * 0.16} y={-h * 0.01} width={w * 0.32} height="6" rx="3" fill={secondary} />
          {detail === 'bell' && <circle cx="0" cy={h * 0.06} r="5" fill={accent} stroke="#1E293B" strokeWidth="1.5" />}
        </g>
      );
    }

    case 'dog': {
      return (
        <g transform={transform}>
          {/* Body */}
          <ellipse cx="0" cy={h * 0.16} rx={w * 0.32} ry={h * 0.26} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {/* Head */}
          <circle cx={-w * 0.14} cy={-h * 0.14} r={w * 0.24} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {/* Floppy Ear */}
          <ellipse cx={-w * 0.28} cy={-h * 0.1} rx={w * 0.1} ry={h * 0.2} fill={secondary} stroke="#1E293B" strokeWidth="2.5" />
          {/* Eye & Nose */}
          <circle cx={-w * 0.2} cy={-h * 0.18} r="4" fill="#0F172A" />
          <circle cx={-w * 0.34} cy={-h * 0.12} r="5" fill="#0F172A" />
          {/* Collar */}
          <rect x={-w * 0.24} y={h * 0.02} width={w * 0.28} height="7" rx="3" fill={accent} />
        </g>
      );
    }

    case 'cow-sheep': {
      return (
        <g transform={transform}>
          {/* Legs */}
          <rect x={-w * 0.26} y={h * 0.18} width="8" height={h * 0.26} fill="#1E293B" />
          <rect x={w * 0.18} y={h * 0.18} width="8" height={h * 0.26} fill="#1E293B" />
          {/* Body */}
          <ellipse cx="0" cy={h * 0.04} rx={w * 0.38} ry={h * 0.26} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {detail === 'spots' && (
            <g fill={secondary}>
              <circle cx={-w * 0.1} cy="0" r={w * 0.11} />
              <circle cx={w * 0.14} cy={h * 0.08} r={w * 0.09} />
            </g>
          )}
          {/* Head */}
          <circle cx={-w * 0.32} cy={-h * 0.08} r={w * 0.2} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <ellipse cx={-w * 0.36} cy={h * 0.02} rx={w * 0.14} ry={h * 0.1} fill={accent} stroke="#1E293B" strokeWidth="2" />
          <circle cx={-w * 0.34} cy={-h * 0.14} r="3.5" fill="#0F172A" />
        </g>
      );
    }

    case 'crab-starfish': {
      return (
        <g transform={transform}>
          {variant === 'starfish' ? (
            <polygon
              points={`0,${-h * 0.45} ${w * 0.14},${-h * 0.12} ${w * 0.46},${-h * 0.1} ${w * 0.22},${h * 0.12} ${w * 0.3},${h * 0.44} 0,${h * 0.25} ${-w * 0.3},${h * 0.44} ${-w * 0.22},${h * 0.12} ${-w * 0.46},${-h * 0.1} ${-w * 0.14},${-h * 0.12}`}
              fill={obj.color}
              stroke="#1E293B"
              strokeWidth="3"
            />
          ) : (
            <g>
              {/* Claws */}
              <circle cx={-w * 0.34} cy={-h * 0.24} r={w * 0.14} fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
              <circle cx={w * 0.34} cy={-h * 0.24} r={w * 0.14} fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
              {/* Shell */}
              <ellipse cx="0" cy={h * 0.06} rx={w * 0.36} ry={h * 0.26} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
              <circle cx={-w * 0.12} cy={-h * 0.06} r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
              <circle cx={w * 0.12} cy={-h * 0.06} r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            </g>
          )}
        </g>
      );
    }

    case 'robot-pet': {
      return (
        <g transform={transform}>
          <line x1="0" y1={-h * 0.25} x2="0" y2={-h * 0.46} stroke={secondary} strokeWidth="4" />
          <circle cx="0" cy={-h * 0.48} r="6" fill={accent} />
          <rect x={-w * 0.32} y={-h * 0.25} width={w * 0.64} height={h * 0.52} rx="12" fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <rect x={-w * 0.22} y={-h * 0.14} width={w * 0.44} height={h * 0.26} rx="6" fill="#0F172A" />
          <circle cx={-w * 0.1} cy={-h * 0.01} r="5" fill={accent} />
          <circle cx={w * 0.1} cy={-h * 0.01} r="5" fill={accent} />
        </g>
      );
    }

    case 'bench-chair': {
      return (
        <g transform={transform}>
          {/* Legs */}
          <rect x={-w * 0.36} y={h * 0.1} width="8" height={h * 0.34} fill="#334155" />
          <rect x={w * 0.36 - 8} y={h * 0.1} width="8" height={h * 0.34} fill="#334155" />
          {/* Backrest */}
          <rect x={-w * 0.42} y={-h * 0.28} width={w * 0.84} height={h * 0.26} rx="6" fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {/* Seat */}
          <rect x={-w * 0.46} y={0} width={w * 0.92} height={h * 0.14} rx="5" fill={secondary} stroke="#1E293B" strokeWidth="3" />
        </g>
      );
    }

    case 'table-desk': {
      return (
        <g transform={transform}>
          {/* Center stand or legs */}
          <rect x="-7" y="0" width="14" height={h * 0.42} fill="#475569" stroke="#1E293B" strokeWidth="2.5" />
          <ellipse cx="0" cy={h * 0.42} rx={w * 0.26} ry="8" fill="#334155" stroke="#1E293B" strokeWidth="2.5" />
          {/* Table top */}
          <ellipse cx="0" cy={-h * 0.04} rx={w * 0.46} ry={h * 0.16} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {detail === 'cloth' && (
            <ellipse cx="0" cy={-h * 0.04} rx={w * 0.3} ry={h * 0.09} fill={secondary} />
          )}
        </g>
      );
    }

    case 'bookshelf': {
      return (
        <g transform={transform}>
          <rect x={-w * 0.44} y={-h * 0.46} width={w * 0.88} height={h * 0.92} rx="6" fill={obj.color} stroke="#1E293B" strokeWidth="3.5" />
          <line x1={-w * 0.4} y1={-h * 0.1} x2={w * 0.4} y2={-h * 0.1} stroke="#78350F" strokeWidth="6" />
          <line x1={-w * 0.4} y1={h * 0.2} x2={w * 0.4} y2={h * 0.2} stroke="#78350F" strokeWidth="6" />
          {/* Books row 1 */}
          <rect x={-w * 0.34} y={-h * 0.38} width={w * 0.14} height={h * 0.26} fill={secondary} stroke="#1E293B" strokeWidth="2" />
          <rect x={-w * 0.16} y={-h * 0.34} width={w * 0.14} height={h * 0.22} fill={accent} stroke="#1E293B" strokeWidth="2" />
          {/* Books row 2 */}
          <rect x={w * 0.06} y={-h * 0.04} width={w * 0.22} height={h * 0.22} fill={accent} stroke="#1E293B" strokeWidth="2" />
          {detail === 'trophy' && (
            <circle cx={w * 0.2} cy={-h * 0.26} r="10" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
          )}
        </g>
      );
    }

    case 'computer-monitor': {
      return (
        <g transform={transform}>
          <rect x="-8" y={h * 0.18} width="16" height={h * 0.2} fill="#64748B" />
          <rect x={-w * 0.22} y={h * 0.36} width={w * 0.44} height="8" rx="4" fill="#475569" />
          <rect x={-w * 0.46} y={-h * 0.38} width={w * 0.92} height={h * 0.58} rx="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
          <rect x={-w * 0.4} y={-h * 0.32} width={w * 0.8} height={h * 0.46} rx="4" fill={obj.color} />
          {detail === 'chart' ? (
            <g fill={accent}>
              <rect x={-w * 0.26} y={-h * 0.08} width="10" height="16" />
              <rect x={-w * 0.06} y={-h * 0.18} width="10" height="26" />
              <rect x={w * 0.14} y={-h * 0.24} width="10" height="32" />
            </g>
          ) : (
            <circle cx="0" cy={-h * 0.1} r="12" fill={secondary} />
          )}
        </g>
      );
    }

    case 'coffee-cake': {
      return (
        <g transform={transform}>
          {variant === 'cake' ? (
            <g>
              <ellipse cx="0" cy={h * 0.26} rx={w * 0.44} ry="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
              <rect x={-w * 0.32} y={-h * 0.12} width={w * 0.64} height={h * 0.36} rx="5" fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
              <circle cx="0" cy={-h * 0.22} r="7" fill={accent} stroke="#1E293B" strokeWidth="2" />
            </g>
          ) : (
            <g>
              {/* Cup handle */}
              <circle cx={w * 0.28} cy={h * 0.04} r={w * 0.14} fill="none" stroke={obj.color} strokeWidth="5" />
              {/* Cup body */}
              <rect x={-w * 0.28} y={-h * 0.16} width={w * 0.56} height={h * 0.44} rx="8" fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
              <ellipse cx="0" cy={h * 0.28} rx={w * 0.38} ry="6" fill={secondary} stroke="#1E293B" strokeWidth="2" />
            </g>
          )}
        </g>
      );
    }

    case 'street-lamp': {
      return (
        <g transform={transform}>
          <rect x="-5" y={-h * 0.28} width="10" height={h * 0.74} fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <rect x="-14" y={h * 0.4} width="28" height="10" rx="4" fill="#1E293B" />
          <circle cx="0" cy={-h * 0.34} r={w * 0.34} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {detail === 'glow' && (
            <circle cx="0" cy={-h * 0.34} r={w * 0.48} fill={obj.color} opacity="0.3" />
          )}
        </g>
      );
    }

    case 'bicycle-scooter': {
      return (
        <g transform={transform}>
          {/* Wheels */}
          <circle cx={-w * 0.28} cy={h * 0.22} r={w * 0.18} fill="none" stroke="#1E293B" strokeWidth="5" />
          <circle cx={w * 0.28} cy={h * 0.22} r={w * 0.18} fill="none" stroke="#1E293B" strokeWidth="5" />
          {/* Frame */}
          <polyline
            points={`${-w * 0.28},${h * 0.22} -4,${-h * 0.06} ${w * 0.24},${-h * 0.06} ${w * 0.28},${h * 0.22}`}
            fill="none"
            stroke={obj.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1={w * 0.2} y1={-h * 0.26} x2={w * 0.28} y2={h * 0.22} stroke={obj.color} strokeWidth="5" />
          {/* Basket */}
          {detail === 'basket' && (
            <rect x={w * 0.22} y={-h * 0.22} width="16" height="14" rx="3" fill={accent} stroke="#1E293B" strokeWidth="2" />
          )}
        </g>
      );
    }

    case 'beach-umbrella': {
      return (
        <g transform={transform}>
          <line x1="0" y1={-h * 0.2} x2="0" y2={h * 0.48} stroke="#E2E8F0" strokeWidth="6" />
          <path
            d={`M${-w * 0.48} ${-h * 0.05} Q0 ${-h * 0.62} ${w * 0.48} ${-h * 0.05} Z`}
            fill={obj.color}
            stroke="#1E293B"
            strokeWidth="3"
          />
          <path
            d={`M${-w * 0.2} ${-h * 0.05} Q0 ${-h * 0.56} ${w * 0.2} ${-h * 0.05} Z`}
            fill={secondary}
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        </g>
      );
    }

    case 'surfboard': {
      return (
        <g transform={transform}>
          <ellipse cx="0" cy="0" rx={w * 0.24} ry={h * 0.46} fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          <line x1="0" y1={-h * 0.44} x2="0" y2={h * 0.44} stroke={secondary} strokeWidth="6" />
          {detail === 'stripe' && (
            <rect x={-w * 0.2} y="-8" width={w * 0.4} height="16" fill={accent} />
          )}
        </g>
      );
    }

    case 'sandcastle': {
      return (
        <g transform={transform}>
          {/* Flag */}
          <line x1="0" y1={-h * 0.46} x2="0" y2={-h * 0.16} stroke="#78350F" strokeWidth="3" />
          <polygon points={`0,${-h * 0.46} 22,${-h * 0.36} 0,${-h * 0.26}`} fill={accent} />
          {/* Towers */}
          <rect x={-w * 0.38} y="0" width={w * 0.76} height={h * 0.42} rx="4" fill={obj.color} stroke="#B45309" strokeWidth="3" />
          <rect x={-w * 0.18} y={-h * 0.22} width={w * 0.36} height={h * 0.24} fill={obj.color} stroke="#B45309" strokeWidth="3" />
          {/* Arch door */}
          <path d={`M-12 ${h * 0.42} L-12 ${h * 0.18} Q0 ${h * 0.08} 12 ${h * 0.18} L12 ${h * 0.42} Z`} fill="#78350F" />
        </g>
      );
    }

    case 'balloon-bunch': {
      return (
        <g transform={transform}>
          <line x1="-10" y1="0" x2="0" y2={h * 0.44} stroke="#E2E8F0" strokeWidth="2.5" />
          <line x1="10" y1="-6" x2="0" y2={h * 0.44} stroke="#E2E8F0" strokeWidth="2.5" />
          <ellipse cx="-12" cy={-h * 0.14} rx={w * 0.24} ry={h * 0.24} fill={obj.color} stroke="#1E293B" strokeWidth="2.5" />
          <ellipse cx="12" cy={-h * 0.2} rx={w * 0.24} ry={h * 0.24} fill={secondary} stroke="#1E293B" strokeWidth="2.5" />
          {detail === 'triple' && (
            <ellipse cx="0" cy={-h * 0.3} rx={w * 0.22} ry={h * 0.22} fill={accent} stroke="#1E293B" strokeWidth="2.5" />
          )}
        </g>
      );
    }

    case 'signboard': {
      return (
        <g transform={transform}>
          <rect x="-5" y="0" width="10" height={h * 0.46} fill="#78350F" />
          <rect x={-w * 0.42} y={-h * 0.36} width={w * 0.84} height={h * 0.44} rx="8" fill={obj.color} stroke={secondary} strokeWidth="4" />
          <circle cx={-w * 0.2} cy={-h * 0.14} r="7" fill={accent} />
          <rect x="-4" y={-h * 0.2} width={w * 0.32} height="12" rx="4" fill={secondary} />
        </g>
      );
    }

    case 'clock-frame': {
      return (
        <g transform={transform}>
          <circle cx="0" cy="0" r={w * 0.42} fill={obj.color} stroke={secondary} strokeWidth="5" />
          <line x1="0" y1="0" x2="0" y2={-w * 0.26} stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
          <line
            x1="0"
            y1="0"
            x2={detail === 'left-hand' ? -w * 0.22 : w * 0.22}
            y2="0"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="4" fill="#0F172A" />
        </g>
      );
    }

    case 'tractor-car':
    default: {
      return (
        <g transform={transform}>
          {/* Body */}
          <rect x={-w * 0.44} y={-h * 0.08} width={w * 0.88} height={h * 0.32} rx="10" fill={obj.color} stroke="#1E293B" strokeWidth="3" />
          {/* Cabin */}
          <rect x={-w * 0.24} y={-h * 0.34} width={w * 0.48} height={h * 0.28} rx="8" fill={secondary} stroke="#1E293B" strokeWidth="3" />
          {/* Wheels */}
          <circle cx={-w * 0.24} cy={h * 0.26} r={w * 0.16} fill="#1E293B" stroke={accent} strokeWidth="4" />
          <circle cx={w * 0.24} cy={h * 0.26} r={w * 0.16} fill="#1E293B" stroke={accent} strokeWidth="4" />
        </g>
      );
    }
  }
};
