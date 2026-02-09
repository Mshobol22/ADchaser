'use client';

import { useState, useCallback } from 'react';
import { Feed } from './Feed';
import { AdInsightModal, type AdInsight } from './AdInsightModal';
import type { Ad } from '@/types/supabase';

export interface LibraryWithModalProps {
  ads: Ad[];
  /** When provided (e.g. on dashboard), removing an ad calls this and closes the modal for optimistic grid update. */
  onRemovedFromVault?: (adId: string) => void;
  /** When remove fails, parent can restore the ad to the grid. */
  onRestoreToVault?: (ad: Ad) => void;
}

/**
 * Page-level wrapper: owns selectedAd state, passes onClick to Feed,
 * and renders AdInsightModal so the modal is connected at the page.
 */
export function LibraryWithModal({
  ads,
  onRemovedFromVault,
  onRestoreToVault,
}: LibraryWithModalProps) {
  const [selectedAd, setSelectedAd] = useState<AdInsight | null>(null);

  const handleAdClick = useCallback((ad: Ad) => setSelectedAd(ad), []);
  const handleClose = useCallback(() => setSelectedAd(null), []);

  const handleRemovedFromVault = useCallback(
    (adId: string) => {
      onRemovedFromVault?.(adId);
      setSelectedAd(null);
    },
    [onRemovedFromVault]
  );

  return (
    <>
      <Feed ads={ads} onAdClick={handleAdClick} />
      <AdInsightModal
        ad={selectedAd}
        open={!!selectedAd}
        onOpenChange={(open) => !open && handleClose()}
        onRemovedFromVault={handleRemovedFromVault}
        onRestoreToVault={onRestoreToVault}
      />
    </>
  );
}
