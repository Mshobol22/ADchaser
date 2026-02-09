'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import type { Ad } from '@/types/supabase';
import { createClerkSupabaseClient } from '@/lib/supabaseClient';
import { PricingModal } from '@/components/pricing/PricingModal';

/** Extended ad shape for insight modal (optional fields for future schema) */
export type AdInsight = Ad & {
  visual_style?: string;
  emotional_trigger?: string;
  primary_benefit?: string;
};

export interface AdInsightModalProps {
  ad: AdInsight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user removes ad from vault (optimistic). Parent can remove from grid. */
  onRemovedFromVault?: (adId: string) => void;
  /** Called when remove fails so parent can restore the ad to the grid. */
  onRestoreToVault?: (ad: Ad) => void;
}

function getScoreColor(rating: number): string {
  if (rating > 8) return 'text-green-400';
  if (rating > 5) return 'text-yellow-400';
  return 'text-slate-400';
}

function isVideoAd(ad: Ad): boolean {
  return ad.format === 'video' || ad.media_url?.endsWith('.mp4') || ad.media_url?.includes('video');
}

export function AdInsightModal({
  ad,
  open,
  onOpenChange,
  onRemovedFromVault,
  onRestoreToVault,
}: AdInsightModalProps) {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const isPro = user?.publicMetadata?.isPro === true;

  // Check saved status when modal opens and user is signed in
  useEffect(() => {
    if (!open || !ad?.id || !isSignedIn) {
      if (!open || !ad?.id) return;
      if (!isSignedIn) setIsSaved(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const token = await getToken({ template: 'supabase' });
      const supabaseWithAuth = createClerkSupabaseClient(token);
      const { data } = await supabaseWithAuth
        .from('saved_ads')
        .select('id')
        .eq('ad_id', ad.id)
        .maybeSingle();
      if (!cancelled) setIsSaved(!!data);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, ad?.id, isSignedIn, getToken]);

  const handleSaveClick = useCallback(async () => {
    if (!ad) return;
    if (!isSignedIn) {
      router.push('/sign-up');
      return;
    }
    const token = await getToken({ template: 'supabase' });
    const supabaseWithAuth = createClerkSupabaseClient(token);
    const nextSaved = !isSaved;

    if (nextSaved) {
      const userId = user?.id ?? '';
      const { count } = await supabaseWithAuth
        .from('saved_ads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (count !== null && count >= 3 && !isPro) {
        setShowPricingModal(true);
        return;
      }
      setIsSaved(true); // optimistic after limit check
      const { error } = await supabaseWithAuth
        .from('saved_ads')
        .insert({ user_id: userId, ad_id: ad.id });
      if (error) {
        if (error.code === '23505') {
          toast.success('Ad saved to Vault');
          return;
        }
        setIsSaved(false);
        toast.error(error.message ?? 'Could not save');
      } else {
        toast.success('Ad saved to Vault');
      }
    } else {
      setIsSaved(false); // optimistic for remove
      onRemovedFromVault?.(ad.id);
      const userId = user?.id ?? '';
      const { error } = await supabaseWithAuth
        .from('saved_ads')
        .delete()
        .eq('user_id', userId)
        .eq('ad_id', ad.id);
      if (error) {
        setIsSaved(true);
        onRestoreToVault?.(ad);
        toast.error(error.message ?? 'Could not remove');
      } else {
        toast.success('Removed from Vault');
      }
    }
  }, [ad, isSignedIn, isSaved, router, getToken, user?.id, onRemovedFromVault, onRestoreToVault, isPro]);

  if (!ad) return null;

  const rating = typeof ad.hook_rating === 'number' ? ad.hook_rating : 0;
  const showVideo = isVideoAd(ad);
  const posterUrl = ad.thumbnail_url || ad.media_url;

  return (
    <>
      <PricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
        currentPlan="free"
      />
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 grid h-[85vh] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-2">
            {/* Col 1: Media */}
            <div className="relative flex h-full min-h-0 w-full items-center justify-center bg-slate-800/80 p-4 md:rounded-l-2xl">
              {showVideo ? (
                <video
                  src={ad.media_url}
                  poster={posterUrl}
                  controls
                  playsInline
                  className="h-full max-h-full w-full rounded-xl object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={ad.media_url}
                  alt={ad.headline || ad.brand_name}
                  className="h-full max-h-full w-full rounded-xl object-cover"
                />
              )}
            </div>

            {/* Col 2: Data sidebar */}
            <div className="flex h-full min-h-0 flex-col overflow-y-auto border-t border-white/10 md:border-t-0 md:border-l md:rounded-r-2xl">
              <div className="flex flex-col gap-6 p-6">
                {/* Top: Brand + Save to Board */}
                <div className="flex flex-shrink-0 items-start justify-between gap-4">
                  <Dialog.Title
                    className="font-serif text-2xl font-semibold tracking-tight text-white md:text-3xl"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    {ad.brand_name}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className={
                      isSaved
                        ? 'flex shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white/90 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400'
                        : 'flex shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/5 hover:text-white'
                    }
                  >
                    <Bookmark
                      className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                      aria-hidden
                    />
                    {isSaved ? 'Remove from Vault' : 'Save to Vault'}
                  </button>
                </div>

                {/* Score Card */}
                <div className="rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Hook Score
                  </p>
                  <p
                    className={`mt-1 font-serif text-3xl font-semibold ${getScoreColor(rating)}`}
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    {rating > 0 ? `${rating.toFixed(1)}/10` : '—/10'}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {ad.industry ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      {ad.industry}
                    </span>
                  ) : null}
                  {ad.visual_style ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      {ad.visual_style}
                    </span>
                  ) : null}
                  {ad.emotional_trigger ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      {ad.emotional_trigger}
                    </span>
                  ) : null}
                </div>

                {/* Analysis */}
                <div className="space-y-4">
                  {ad.primary_benefit ? (
                    <div>
                      <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Primary benefit
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {ad.primary_benefit}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Ad copy
                    </h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      {ad.headline ? (
                        <p className="font-medium text-white">{ad.headline}</p>
                      ) : null}
                      {ad.primary_text ? (
                        <p className="leading-relaxed">{ad.primary_text}</p>
                      ) : null}
                      {!ad.headline && !ad.primary_text ? (
                        <p className="text-slate-500">No copy available.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    </>
  );
}
