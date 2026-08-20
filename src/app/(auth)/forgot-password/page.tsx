'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { appConfig } from '@/config/app';
import { getSupabaseClient } from '@/lib/auth-client';
import { logger } from '@/lib/logger';

export default function ForgotPasswordPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
      setEmail('');
      logger.info('Password reset email sent', { email });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
      logger.error('Password reset error', err as Error);
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
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <p className="text-surface-600 text-center text-sm mt-2">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-green-700 text-sm">
            Check your email for a password reset link.
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading || success}
        />

        <Button type="submit" isLoading={isLoading} className="w-full" disabled={success}>
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-surface-600 mt-6">
        Remember your password?{' '}
        <Link href="/login" className="text-stark-600 font-medium hover:text-stark-700">
          Sign In
        </Link>
      </p>
    </Card>
  );
}
