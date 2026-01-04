import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  gradient?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  className?: string;
}

export function StatCard({ title, value, icon, trend, gradient, className }: StatCardProps) {
  const gradientClasses = {
    primary: 'gradient-primary',
    secondary: 'gradient-secondary',
    success: 'gradient-success',
    warning: 'gradient-warning',
    info: 'gradient-info',
  };

  const isGradient = !!gradient;

  return (
    <div
      className={cn(
        'relative rounded-lg p-6 transition-all duration-300 overflow-hidden',
        isGradient
          ? `${gradientClasses[gradient]} text-white shadow-material-lg hover:shadow-material-xl hover:-translate-y-1`
          : 'bg-card shadow-material-md hover:shadow-material-lg hover:-translate-y-0.5 border border-border',
        className
      )}
    >
      {/* Top accent bar for non-gradient cards */}
      {!isGradient && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-sm font-medium uppercase tracking-wider',
            isGradient ? 'text-white/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className={cn(
            'mt-2 text-3xl font-bold',
            isGradient ? 'text-white' : 'text-foreground'
          )}>
            {value}
          </p>
          {trend && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
              isGradient
                ? 'bg-white/20 text-white'
                : trend.positive
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
            )}>
              {trend.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className={cn(
          'rounded-xl p-3 flex items-center justify-center',
          isGradient ? 'bg-white/20' : 'gradient-primary'
        )}>
          <div className={cn(
            '[&>svg]:h-6 [&>svg]:w-6',
            isGradient ? 'text-white' : 'text-white'
          )}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
