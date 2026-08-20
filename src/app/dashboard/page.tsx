'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Badge, Avatar } from '@/components/ui';
import { getSupabaseClient } from '@/lib/auth-client';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';

interface DashboardData {
  user: { email: string; displayName?: string } | null;
  isLoading: boolean;
  error: string;
}

export default function DashboardPage(): React.ReactElement {
  const [data, setData] = useState<DashboardData>({
    user: null,
    isLoading: true,
    error: '',
  });
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          logger.warn('No authenticated user found');
          router.push('/login');
          return;
        }

        setData({
          user: {
            email: user.email || '',
            displayName: user.user_metadata?.display_name,
          },
          isLoading: false,
          error: '',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load user';
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        logger.error('Failed to load user', err as Error);
      }
    };

    loadUser();
  }, [router, supabase]);

  const handleLogout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      logger.info('User logged out');
      router.push('/');
    } catch (err) {
      logger.error('Logout failed', err as Error);
    }
  };

  if (data.isLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">Loading...</Card>
        </div>
      </div>
    );
  }

  if (data.error || !data.user) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center text-red-600">
            {data.error || 'Failed to load dashboard'}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navbar */}
      <nav className="bg-white border-b-2 border-surface-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded bg-stark-600" />
            Stark
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-surface-600">{data.user.displayName || data.user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {data.user.displayName || 'User'}!
          </h1>
          <p className="text-surface-600">Manage your Stark Industries workspace</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/flow/projects">
                <Button variant="secondary" className="w-full text-left">
                  Create Project
                </Button>
              </Link>
              <Link href="/nova">
                <Button variant="secondary" className="w-full text-left">
                  Ask Nova
                </Button>
              </Link>
            </div>
          </Card>

          {/* Products Overview */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Your Products</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-stark-600">0</p>
                <p className="text-sm text-surface-600">Products Created</p>
              </div>
              <Link href="/market">
                <Button variant="outline" size="sm">
                  View Market
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Apps Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Nova',
                description: 'AI-powered assistant',
                href: '/nova',
                status: 'active',
              },
              {
                name: 'Flow',
                description: 'Project management',
                href: '/flow',
                status: 'active',
              },
              {
                name: 'Forge',
                description: 'Website builder',
                href: '/forge',
                status: 'active',
              },
              {
                name: 'Market',
                description: 'Digital marketplace',
                href: '/market',
                status: 'active',
              },
            ].map((app) => (
              <Link key={app.name} href={app.href}>
                <Card className="p-4 cursor-pointer hover:shadow-lg">
                  <div className="mb-3 flex justify-between items-start">
                    <h3 className="font-bold">{app.name}</h3>
                    <Badge variant="success">Live</Badge>
                  </div>
                  <p className="text-sm text-surface-600">{app.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Card>

        {/* Integration Status */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-600">Database</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-600">Authentication</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-600">AI Provider</span>
              <Badge variant="warning">Pending Config</Badge>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
