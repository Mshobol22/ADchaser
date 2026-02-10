import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const webhookSecret = process.env.WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error('[Clerk Webhook] Missing WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const payload = await req.text();
  const headersList = await headers();
  const svixId = headersList.get('svix-id');
  const svixTimestamp = headersList.get('svix-timestamp');
  const svixSignature = headersList.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  let evt: { type: string; data: { id: string; email_addresses?: { email_address: string }[] } };
  try {
    const wh = new Webhook(webhookSecret);
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as typeof evt;
  } catch (err) {
    console.error('[Clerk Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (evt.type) {
    case 'user.created': {
      const id = evt.data.id;
      const emailAddresses = evt.data.email_addresses ?? [];
      const primaryEmail = emailAddresses[0]?.email_address ?? null;

      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

      const { error } = await supabase.from('users').insert({
        id,
        email: primaryEmail,
        subscription_plan: 'free',
      } as any);

      if (error) {
        console.error('[Clerk Webhook] user.created insert failed:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ message: 'OK' });
    }
    default:
      return NextResponse.json({ message: 'OK' });
  }
}
