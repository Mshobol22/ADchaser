import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? undefined;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 2900,
          product_data: {
            name: 'ADchaser Pro',
          },
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    success_url: `${baseUrl}/dashboard?success=true`,
    cancel_url: `${baseUrl}/dashboard?canceled=true`,
    ...(userEmail && { customer_email: userEmail }),
  });

  return NextResponse.json({ url: session.url });
}
