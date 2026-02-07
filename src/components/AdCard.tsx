'use client';

import { motion } from 'framer-motion';
import type { Ad } from '@/types/supabase';

function formatLabel(value: Ad['format']): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function AdCard({ ad }: { ad: Ad }) {
  return (
    <motion.article
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
      whileHover={{ y: -2 }}
      transition={{ type: 'tween', duration: 0.2 }}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] w-full bg-slate-800/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.media_url}
          alt={ad.headline}
          className="h-full w-full object-cover"
        />
        <span className="absolute right-2 top-2 rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
          {formatLabel(ad.format)}
        </span>
      </div>

      {/* Copy */}
      <div className="border-t border-white/5 p-3">
        <p className="font-semibold text-white">{ad.brand_name}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-slate-400">
          {ad.headline}
        </p>
      </div>
    </motion.article>
  );
}
