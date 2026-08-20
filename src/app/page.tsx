import Link from 'next/link';
import { Button } from '@/components/ui';
import { appConfig } from '@/config/app';

export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stark-50 to-surface-50">
      <nav className="bg-white border-b-2 border-surface-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded bg-stark-600" />
            {appConfig.name}
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">{appConfig.tagline}</h1>
          <p className="text-xl text-surface-600 mb-8">{appConfig.description}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
