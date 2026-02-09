'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import type { Ad } from '@/types/supabase';

/**
 * Fetches ads saved by the current user (Clerk), ordered by saved_at descending.
 * Equivalent to: SELECT * FROM ads WHERE id IN (SELECT ad_id FROM saved_ads WHERE user_id = ?) ORDER BY saved_at DESC
 * Uses createServerClient with the Clerk JWT so RLS on saved_ads applies.
 * Return type matches the Ad interface used by BentoGrid.
 */
export async function fetchSavedAds(): Promise<Ad[]> {
  const { getToken, userId } = await auth();
  if (!userId) return [];

  const token = await getToken({ template: 'supabase' });
  const supabase = createServerClient(token ?? null);

  const { data: saved } = await supabase
    .from('saved_ads')
    .select('ad_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Cast 's' to 'any' to bypass strict type checking for saved_ads table
  const adIds = saved?.map((s: any) => s.ad_id) ?? [];
  if (adIds.length === 0) return [];

  const { data: ads } = await supabase.from('ads').select('*').in('id', adIds);
  const list = (ads ?? []) as Ad[];
  const orderMap = new Map(adIds.map((id, i) => [id, i]));
  return list.slice().sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
}
