import { clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId in session metadata' }, { status: 400 });
  }

  // Sync with Clerk metadata so the frontend (Pro badge, limits) updates instantly
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { isPro: true },
  });

  return NextResponse.json({ received: true }, { status: 200 });
}
