'use server';

import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getIsPro() {
  const { userId, getToken } = await auth();
  if (!userId) return false;

  const token = await getToken({ template: 'supabase' });
  const supabase = createServerClient(token ?? null);

  const { data } = await supabase
    .from('users')
    .select('subscription_plan')
    .eq('id', userId)
    .maybeSingle();

  return (data as any)?.subscription_plan === 'pro';
}

export async function saveAdToVault(adId: string) {
  const { userId, getToken } = await auth();
  if (!userId) return { ok: false, error: 'Unauthorized' };

  const token = await getToken({ template: 'supabase' });
  const supabase = createServerClient(token ?? null);

  // 1. Check Real Pro Status (Single Source of Truth)
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_plan')
    .eq('id', userId)
    .maybeSingle();

  const isPro = (userData as any)?.subscription_plan === 'pro';
  console.log(`[SaveAd] User: ${userId} | Plan: ${isPro ? 'PRO' : 'FREE'}`);

  // 2. Enforce Limits (ONLY if not Pro)
  if (!isPro) {
    const { count } = await supabase
      .from('saved_ads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (count !== null && count >= 3) {
      console.log('[SaveAd] Limit Reached for Free User');
      return { ok: false, error: 'LIMIT_REACHED' };
    }
  }

  // 3. Perform Save
  const { error } = await supabase
    .from('saved_ads')
    .insert({ user_id: userId, ad_id: adId } as any);

  if (error) {
    if (error.code === '23505') return { ok: true, message: 'Already saved' };
    return { ok: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { ok: true };
}
