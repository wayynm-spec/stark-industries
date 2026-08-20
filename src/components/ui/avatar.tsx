import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = 'Avatar', name, size = 'md', className, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    const initials = name ? getInitials(name) : 'U';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-stark-100 text-stark-700 font-semibold overflow-hidden',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
export default Avatar;
