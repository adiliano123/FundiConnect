'use client';

import { cn } from '@/utils/cn';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-6 h-6' };

export default function StarRating({ rating, maxRating = 5, interactive, onChange, size = 'md' }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${rating} of ${maxRating}`}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i + 1)}
          className={cn(!interactive && 'cursor-default pointer-events-none')}
          aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
        >
          <Star
            className={cn(
              sizes[size],
              i < rating ? 'fill-[#FFD530] text-[#FFD530]' : 'fill-none text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}
