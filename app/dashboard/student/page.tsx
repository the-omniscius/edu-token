'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in since we don't have UserContext working
    router.push('/auth/sign-in');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Please sign in to access your dashboard.</p>
      </div>
    </div>
  );
} 