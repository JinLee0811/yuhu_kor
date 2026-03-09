import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-body2 font-semibold',
        'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50',
        className
      )}
    />
  );
}
