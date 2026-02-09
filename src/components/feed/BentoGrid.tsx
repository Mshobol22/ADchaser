'use client';

import Masonry from 'react-masonry-css';
import { AdCard } from '@/components/AdCard';
import type { Ad } from '@/types/supabase';

const breakpointColumns = {
  default: 4,
  1280: 4,
  768: 2,
  0: 1,
};

export interface BentoGridProps {
  ads: Ad[];
  onAdClick?: (ad: Ad) => void;
}

function EmptyState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      {/* PostHog-style clean illustration: magnifying glass + document */}
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full text-slate-600"
          aria-hidden
        >
          <circle
            cx="52"
            cy="52"
            r="28"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />
          <path
            d="M78 78l22 22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
          <rect
            x="32"
            y="68"
            width="36"
            height="28"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.25"
          />
          <path
            d="M38 76h24M38 84h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.25"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">No results found</h2>
        <p className="max-w-sm text-sm text-slate-500">
          Try a different search or filter to find ads.
        </p>
      </div>
    </div>
  );
}

export function BentoGrid({ ads, onAdClick }: BentoGridProps) {
  if (ads.length === 0) {
    return <EmptyState />;
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {ads.map((ad) => (
        <div key={ad.id} className="mb-4 break-inside-avoid">
          <AdCard ad={ad} onSelect={onAdClick ? () => onAdClick(ad) : undefined} />
        </div>
      ))}
    </Masonry>
  );
}
