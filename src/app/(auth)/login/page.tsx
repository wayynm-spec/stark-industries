'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { appConfig } from '@/config/app';
import { getSupabaseClient } from '@/lib/auth-client';
import { logger } from '@/lib/logger';

export default function LoginPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered) {
      setError('Account created! Please check your email to confirm before logging in.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      if (!data.user) throw new Error('Login failed');

      logger.info('User logged in', { userId: data.user.id });
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      logger.error('Login error', err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <div className="w-8 h-8 rounded bg-stark-600" />
          <span className="font-bold text-lg">{appConfig.name}</span>
        </div>
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <p className="text-surface-600 text-center text-sm mt-2">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className={`border-2 rounded-lg p-3 text-sm ${
            error.includes('confirmed')
              ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm">
        <Link href="/forgot-password" className="text-stark-600 hover:text-stark-700 font-medium block">
          Forgot password?
        </Link>
        <p className="text-surface-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-stark-600 font-medium hover:text-stark-700">
            Sign Up
          </Link>
        </p>
      </div>
    </Card>
  );
}
