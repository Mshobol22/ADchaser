import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceRoleClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const { data: userRow } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();

  const stripeCustomerId = (userRow as { stripe_customer_id?: string } | null)?.stripe_customer_id;
  if (!stripeCustomerId || typeof stripeCustomerId !== 'string') {
    return NextResponse.json(
      { error: 'No Stripe customer found. Subscribe first or contact support.' },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const returnUrl = `${baseUrl}/dashboard`;

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });

  return NextResponse.json({ url: session.url });
}
