'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import type { Ad } from '@/types/supabase';

export async function getSavedAds(): Promise<Ad[]> {
  const { getToken, userId } = await auth();
  if (!userId) return [];

  const token = await getToken();
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
  const list = ads ?? [];
  const orderMap = new Map(adIds.map((id, i) => [id, i]));
  return list.slice().sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
}

export async function checkSavedAd(adId: string): Promise<boolean> {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) return false;

  const supabase = createServerClient(token);
  const { data } = await supabase
    .from('saved_ads')
    .select('id')
    .eq('ad_id', adId)
    .maybeSingle();
  return !!data;
}

export async function saveAdToVault(adId: string): Promise<{ ok: boolean; error?: string }> {
  const { getToken, userId } = await auth();
  if (!userId) return { ok: false, error: 'Not signed in' };

  const token = await getToken();
  const supabase = createServerClient(token ?? null);
  const { error } = await supabase.from('saved_ads').insert({ user_id: userId, ad_id: adId });

  if (error) {
    if (error.code === '23505') return { ok: true }; // unique violation = already saved
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function removeAdFromVault(adId: string): Promise<{ ok: boolean; error?: string }> {
  const { getToken, userId } = await auth();
  if (!userId) return { ok: false, error: 'Not signed in' };

  const token = await getToken();
  const supabase = createServerClient(token ?? null);
  const { error } = await supabase
    .from('saved_ads')
    .delete()
    .eq('user_id', userId)
    .eq('ad_id', adId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
