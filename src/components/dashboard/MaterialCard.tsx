import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MaterialCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  title?: string;
  action?: ReactNode;
}

export function MaterialCard({ children, className, hover = true, title, action }: MaterialCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-card p-6 shadow-material-md transition-all duration-300',
        hover && 'hover:shadow-material-lg hover:-translate-y-0.5',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
