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

  // Extract data for users table (email + Stripe customer id for portal)
  const email = session.customer_details?.email ?? session.customer_email ?? undefined;
  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : (session.customer as { id?: string } | null)?.id ?? undefined;

  const supabase = createServiceRoleClient();
  console.log('Using SERVICE_ROLE client for Supabase users upsert');
  await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        email,
        stripe_customer_id: customerId,
        subscription_plan: 'pro',
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: 'id' }
    );

  return NextResponse.json({ received: true }, { status: 200 });
}
