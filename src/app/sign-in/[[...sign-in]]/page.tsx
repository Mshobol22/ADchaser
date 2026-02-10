import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { AuthPageWrapper } from '@/components/auth/AuthPageWrapper';

export default function SignInPage() {
  return (
    <AuthPageWrapper>
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <SignIn
          forceRedirectUrl="/"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl',
            },
          }}
        />
        <div className="text-center text-sm text-slate-400">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-emerald-400 hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-emerald-400 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </AuthPageWrapper>
  );
}
