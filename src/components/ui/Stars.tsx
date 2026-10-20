import { PiStarFill, PiStarHalfFill, PiStar } from 'react-icons/pi';
import { cn } from '@/lib/cn';

export function Stars({ rating, count, className, size = 'sm' }: { rating: number; count?: number; className?: string; size?: 'sm' | 'md' }) {
  const icon = size === 'md' ? 'size-[1.1rem]' : 'size-3.5';
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="flex text-oro" role="img" aria-label={`Calificación ${rating.toFixed(1)} de 5`}>
        {[1, 2, 3, 4, 5].map((i) =>
          rating >= i ? <PiStarFill key={i} className={icon} /> : rating >= i - 0.5 ? <PiStarHalfFill key={i} className={icon} /> : <PiStar key={i} className={icon} />,
        )}
      </span>
      {count !== undefined && <span className="text-xs text-humo">({count})</span>}
    </span>
  );
}
