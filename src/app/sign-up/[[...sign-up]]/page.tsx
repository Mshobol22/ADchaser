import { SignUp } from '@clerk/nextjs';
import { AuthPageWrapper } from '@/components/auth/AuthPageWrapper';

export default function SignUpPage() {
  return (
    <AuthPageWrapper>
      <div className="flex w-full max-w-md justify-center">
        <SignUp
          forceRedirectUrl="/"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
          termsPageUrl="/terms"
          privacyPageUrl="/privacy"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl',
            },
          }}
        />
      </div>
    </AuthPageWrapper>
  );
}
