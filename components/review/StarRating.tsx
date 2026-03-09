'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, size = 'md' }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(starValue)}
            className={cn(
              'flex items-center justify-center disabled:cursor-default',
              size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-11 w-11' : 'h-8 w-8'
            )}
          >
            <Star
              className={cn(
                size === 'lg' ? 'h-7 w-7' : 'h-full w-full',
                filled ? 'fill-accent text-accent' : 'text-muted-foreground/30'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
