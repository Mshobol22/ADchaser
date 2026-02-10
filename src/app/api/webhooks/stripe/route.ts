import { clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const signature = (await headers()).get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Webhook Received:', event.type);
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  console.log('Session Metadata:', session.metadata);
  console.log('Target User ID:', userId);
  if (!userId) {
    console.error('❌ ERROR: No User ID in session metadata!');
    return NextResponse.json({ error: 'Missing userId in session metadata' }, { status: 400 });
  }

  // Sync with Clerk metadata so the frontend (Pro badge, limits) updates instantly
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { isPro: true },
  });

  // Store subscription in Supabase so dashboard header can read real status (SERVICE_ROLE bypasses RLS)
  const supabase = createServiceRoleClient();
  console.log('Using SERVICE_ROLE client for Supabase users upsert');
  // Cast to 'any' to bypass strict type checking for the users table
  await supabase
    .from('users')
    .upsert(
      { id: userId, subscription_plan: 'pro', updated_at: new Date().toISOString() } as any,
      { onConflict: 'id' }
    );

  return NextResponse.json({ received: true }, { status: 200 });
}
