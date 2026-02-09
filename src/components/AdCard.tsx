'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Ad } from '@/types/supabase';

function formatLabel(value: Ad['format']): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isVideoAd(ad: Ad): boolean {
  return ad.format === 'video' || ad.media_url?.endsWith('.mp4') || ad.media_url?.includes('video');
}

export function AdCard({ ad, onSelect }: { ad: Ad; onSelect?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const showVideo = isVideoAd(ad);
  const posterUrl = ad.thumbnail_url || ad.media_url;

  return (
    <motion.article
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10"
      whileHover={{ y: -2 }}
      transition={{ type: 'tween', duration: 0.2 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      onKeyDown={onSelect ? (e) => e.key === 'Enter' && onSelect() : undefined}
    >
      {/* Media: video (hover-to-play) or image */}
      <div className="relative aspect-[4/3] w-full bg-slate-800/50">
        {showVideo ? (
          <video
            ref={videoRef}
            src={ad.media_url}
            poster={posterUrl}
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            preload="metadata"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={ad.media_url}
            alt={ad.headline || ad.brand_name}
            className="h-full w-full object-cover"
          />
        )}
        {/* Top-right: Hook Score badge (glassmorphic); score > 8 = green */}
        <span
          className={`absolute right-2 top-2 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-xs font-medium backdrop-blur-sm ${
            (ad.hook_rating ?? 0) > 8 ? 'text-green-400' : 'text-white/90'
          }`}
        >
          Hook {typeof ad.hook_rating === 'number' ? ad.hook_rating.toFixed(1) : '—'}
        </span>
        <span className="absolute right-2 top-8 rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
          {formatLabel(ad.format)}
        </span>
        {/* Bottom-left of video overlay: industry tag */}
        {ad.industry ? (
          <span className="absolute bottom-2 left-2 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            {ad.industry}
          </span>
        ) : null}
      </div>

      {/* Glass overlay: brand + headline */}
      <div className="absolute inset-x-0 bottom-0 bg-black/40 p-3 backdrop-blur-md">
        <p className="font-medium text-white">{ad.brand_name}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-gray-300">
          {ad.headline || ad.primary_text}
        </p>
      </div>
    </motion.article>
  );
}
