import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | ADchaser',
  description: 'Terms of Service for ADchaser – The TikTok Ad Spy Tool.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-zinc-400 transition hover:text-emerald-400"
        >
          ← Back to ADchaser
        </Link>
        <article className="prose prose-invert prose-slate max-w-none">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
          <p className="text-sm text-zinc-400">Last updated: [Date]</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using ADchaser (&quot;Service&quot;), you agree to be bound by these Terms of
            Service. If you do not agree, do not use the Service. ADchaser is a SaaS product that
            helps users save, organize, and analyze TikTok ads.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old and able to form a binding contract to use the
            Service. By using ADchaser, you represent that you meet these requirements.
          </p>

          <h2>3. Account and Registration</h2>
          <p>
            You may need to create an account to access certain features. You are responsible for
            maintaining the confidentiality of your account credentials and for all activity under
            your account. You must notify us immediately of any unauthorized use at [Contact
            Email].
          </p>

          <h2>4. Subscription and Payment</h2>
          <p>
            Paid plans are billed through our payment processor (Stripe). By subscribing, you agree
            to the applicable pricing and billing terms. Fees are non-refundable except as required
            by law or as stated in our refund policy. We may change pricing with reasonable notice;
            continued use after changes constitutes acceptance.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose or in violation of any laws.</li>
            <li>Scrape, copy, or redistribute content in bulk beyond normal use of the product.</li>
            <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts.</li>
            <li>Resell or sublicense access to the Service without our written permission.</li>
          </ul>
          <p>
            We may suspend or terminate your access if we reasonably believe you have violated
            these terms.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            ADchaser and its content, features, and functionality are owned by us and are protected
            by copyright, trademark, and other laws. You may not copy, modify, or create derivative
            works of our Service without permission.
          </p>

          <h2>7. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
            EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED OR
            ERROR-FREE. USE OF ADCHASER IS AT YOUR OWN RISK.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ADCHASER AND ITS AFFILIATES SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
            LOSS OF PROFITS OR DATA, ARISING FROM YOUR USE OF THE SERVICE.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will post the updated Terms on this
            page and update the &quot;Last updated&quot; date. Your continued use of the Service after
            changes constitutes acceptance. Material changes may be communicated via [Contact Email]
            or in-app notice.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these Terms, contact us at [Contact Email].
          </p>
        </article>
      </div>
    </div>
  );
}
