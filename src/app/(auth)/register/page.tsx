'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { appConfig } from '@/config/app';
import { getSupabaseClient } from '@/lib/auth-client';
import { logger } from '@/lib/logger';

export default function RegisterPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      // Sign up with Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error('Registration failed');

      logger.info('User registered successfully', { userId: signUpData.user.id });

      // Redirect to verification or login
      router.push('/login?registered=true');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      logger.error('Registration error', err as Error);
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
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <p className="text-surface-600 text-center text-sm mt-2">
          Join the ecosystem
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-700 text-sm">
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
          label="Username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          label="Display Name"
          type="text"
          placeholder="Your Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
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
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-600 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-stark-600 font-medium hover:text-stark-700">
          Sign In
        </Link>
      </p>
    </Card>
  );
}
