'use client';

import { useState, useCallback } from 'react';
import { LibraryWithModal } from '@/components/feed/LibraryWithModal';
import type { Ad } from '@/types/supabase';

export interface VaultWithModalProps {
  initialAds: Ad[];
}

/**
 * Dashboard vault: holds ads in state so removing one in the modal
 * updates the grid optimistically (no refetch).
 */
export function VaultWithModal({ initialAds }: VaultWithModalProps) {
  const [ads, setAds] = useState<Ad[]>(initialAds);

  const handleRemovedFromVault = useCallback((adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
  }, []);

  const handleRestoreToVault = useCallback((ad: Ad) => {
    setAds((prev) => [...prev, ad]);
  }, []);

  return (
    <LibraryWithModal
      ads={ads}
      onRemovedFromVault={handleRemovedFromVault}
      onRestoreToVault={handleRestoreToVault}
    />
  );
}
