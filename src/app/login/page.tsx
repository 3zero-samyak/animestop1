import React from 'react';
import LoginShell from '@/components/auth/LoginShell';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  return (
    <>
      <Header />
      <React.Suspense fallback={<div />}>
        <LoginShell />
      </React.Suspense>
      <Footer />
    </>
  );
}
