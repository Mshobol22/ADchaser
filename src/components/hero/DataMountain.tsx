'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type TooltipPayloadItem = { value?: number };
type CustomTooltipProps = { active?: boolean; payload?: TooltipPayloadItem[] };

const MOCK_DATA = [
  { day: 1, score: 52 }, { day: 2, score: 61 }, { day: 3, score: 58 }, { day: 4, score: 72 },
  { day: 5, score: 68 }, { day: 6, score: 85 }, { day: 7, score: 79 }, { day: 8, score: 91 },
  { day: 9, score: 88 }, { day: 10, score: 94 }, { day: 11, score: 82 }, { day: 12, score: 76 },
  { day: 13, score: 89 }, { day: 14, score: 95 }, { day: 15, score: 78 }, { day: 16, score: 71 },
  { day: 17, score: 84 }, { day: 18, score: 92 }, { day: 19, score: 87 }, { day: 20, score: 73 },
  { day: 21, score: 66 }, { day: 22, score: 81 }, { day: 23, score: 90 }, { day: 24, score: 77 },
  { day: 25, score: 69 }, { day: 26, score: 83 }, { day: 27, score: 96 }, { day: 28, score: 74 },
  { day: 29, score: 62 }, { day: 30, score: 58 },
];

const EMERALD_500 = '#10b981';
const EMERALD_900 = '#064e3b';
const EMERALD_400 = '#34d399';

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs font-medium text-slate-400">Hook Score</p>
      <p className="text-lg font-semibold text-emerald-400">{value.toFixed(1)}</p>
    </div>
  );
}

export function DataMountain() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={MOCK_DATA}
          margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
        >
          <defs>
            <linearGradient id="dataMountainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EMERALD_500} stopOpacity={0.2} />
              <stop offset="100%" stopColor={EMERALD_900} stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <XAxis dataKey="day" hide />
          <YAxis hide domain={[30, 110]} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="score"
            fill="url(#dataMountainGradient)"
            stroke={EMERALD_400}
            strokeWidth={2}
            filter="url(#glow)"
            isAnimationActive
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
