import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { appConfig } from '@/config/app';

export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: { displayName: string; avatar?: string };
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, user, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        'sticky top-0 z-40 w-full bg-white border-b-2 border-surface-200',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded bg-stark-600" />
          <span>Stark</span>
        </Link>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-surface-600">{user.displayName}</span>}
        </div>
      </div>
    </nav>
  )
);

Navbar.displayName = 'Navbar';
export default Navbar;
