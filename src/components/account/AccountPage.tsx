'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from '@/store/account';
import { useHydrated } from '@/store/hydration';
import { AuthPanel } from './AuthPanel';
import { AccountDashboard, type View } from './AccountDashboard';

export function AccountPage({ initialView, registerEmail, returnTo }: { initialView: View; registerEmail?: string; returnTo?: string }) {
  const router = useRouter();
  const hydrated = useHydrated(useAccount);
  const user = useAccount((s) => s.user);

  if (!hydrated) {
    return (
      <div className="page py-10" aria-busy="true">
        <div className="h-9 w-48 animate-pulso rounded bg-lino" />
        <div className="mt-8 h-96 animate-pulso rounded-xl bg-lino" />
      </div>
    );
  }

  return (
    <div className="page pt-8 pb-20 md:pt-10">
      {user ? (
        <AccountDashboard initialView={initialView} />
      ) : (
        <>
          <h1 className="mb-6 text-3xl font-semibold tracking-[-0.015em] text-raiz md:text-4xl">Mi cuenta</h1>
          <AuthPanel initialEmail={registerEmail} onDone={returnTo === 'checkout' ? () => router.push('/checkout') : undefined} />
        </>
      )}
    </div>
  );
}
