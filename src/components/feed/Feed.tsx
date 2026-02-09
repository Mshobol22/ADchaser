'use client';

import { useMemo, useState, useCallback } from 'react';
import { CommandBar, type SmartFilter } from './CommandBar';
import { BentoGrid } from './BentoGrid';
import { AdInsightModal, type AdInsight } from './AdInsightModal';
import type { Ad } from '@/types/supabase';

export interface FeedProps {
  ads: Ad[];
  /** When provided, card clicks are reported here and the parent is responsible for rendering AdInsightModal. */
  onAdClick?: (ad: Ad) => void;
}

function matchesSearch(ad: Ad, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const brand = (ad.brand_name ?? '').toLowerCase();
  const headline = (ad.headline ?? '').toLowerCase();
  const primary = (ad.primary_text ?? '').toLowerCase();
  return brand.includes(q) || headline.includes(q) || primary.includes(q);
}

function matchesFilter(ad: Ad, filter: SmartFilter): boolean {
  if (filter === 'All') return true;
  if (filter === 'High Hook Rate (>8)') return (ad.hook_rating ?? 0) > 8;
  const industry = (ad.industry ?? '').toLowerCase();
  const f = filter.toLowerCase();
  if (f === 'e-com') return industry.includes('e-com') || industry.includes('ecom') || industry.includes('e-commerce');
  return industry.includes(f) || industry.replace(/\s+/g, '') === f.replace(/\s+/g, '');
}

export function Feed({ ads, onAdClick }: FeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SmartFilter>('All');
  const [selectedAd, setSelectedAd] = useState<AdInsight | null>(null);

  const handleAdClick = onAdClick ?? setSelectedAd;

  const filteredAds = useMemo(() => {
    return ads.filter(
      (ad) => matchesSearch(ad, searchQuery) && matchesFilter(ad, activeFilter)
    );
  }, [ads, searchQuery, activeFilter]);

  const handleSearch = useCallback((query: string) => setSearchQuery(query), []);
  const handleFilterChange = useCallback((filter: SmartFilter) => setActiveFilter(filter), []);

  return (
    <>
      <div className="h-12 shrink-0" aria-hidden />
      <CommandBar
        searchValue={searchQuery}
        activeFilter={activeFilter}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      <div className="mt-6">
        <BentoGrid ads={filteredAds} onAdClick={handleAdClick} />
      </div>
      {!onAdClick && (
        <AdInsightModal
          ad={selectedAd}
          open={!!selectedAd}
          onOpenChange={(open) => !open && setSelectedAd(null)}
        />
      )}
    </>
  );
}
