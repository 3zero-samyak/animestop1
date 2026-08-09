'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountAccess from './AccountAccess';
import SignInForm from './SignInForm';
import CreateAccountForm from './CreateAccountForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function LoginShell() {
  const search = useSearchParams();
  const router = useRouter();
  const current = search.get('view') || 'access';

  const openSignIn = () => router.push('/login?view=signin');
  const openCreate = () => router.push('/login?view=create');

  return (
    <main className="auth-page">
      {current === 'access' && <AccountAccess onOpenSignIn={openSignIn} onOpenCreate={openCreate} />}
      {current === 'signin' && <SignInForm />}
      {current === 'create' && <CreateAccountForm />}
      {current === 'forgot' && <ForgotPasswordForm />}
    </main>
  );
}
