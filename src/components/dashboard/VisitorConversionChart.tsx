import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { MaterialCard } from './MaterialCard';
import { Loader2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface ConversionDataPoint {
  month: string;
  scheduled: number;
  visited: number;
  enrolled: number;
}

export function VisitorConversionChart() {
  const { t } = useLanguage();
  const [data, setData] = useState<ConversionDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversionData();
  }, []);

  const loadConversionData = async () => {
    try {
      // Get data for the last 6 months
      const months: ConversionDataPoint[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const monthLabel = format(date, 'MMM');

        // Fetch visitors created in this month
        const { data: visitors, error } = await supabase
          .from('visitors')
          .select('status, created_at')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        if (error) throw error;

        const scheduled = visitors?.filter(v => v.status === 'scheduled').length || 0;
        const visited = visitors?.filter(v => v.status === 'visited' || v.status === 'enrolled').length || 0;
        const enrolled = visitors?.filter(v => v.status === 'enrolled').length || 0;

        months.push({
          month: monthLabel,
          scheduled,
          visited,
          enrolled,
        });
      }

      setData(months);
    } catch (error) {
      console.error('Failed to load conversion data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MaterialCard title={t('conversionTrends')}>
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MaterialCard>
    );
  }

  return (
    <MaterialCard title={t('conversionTrends')}>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorVisited" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                boxShadow: 'var(--shadow-md)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  scheduled: t('scheduled'),
                  visited: t('visited'),
                  enrolled: t('enrolledStatus'),
                };
                return <span className="text-sm">{labels[value] || value}</span>;
              }}
            />
            <Area
              type="monotone"
              dataKey="scheduled"
              stroke="hsl(var(--info))"
              fillOpacity={1}
              fill="url(#colorScheduled)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="visited"
              stroke="hsl(var(--warning))"
              fillOpacity={1}
              fill="url(#colorVisited)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="enrolled"
              stroke="hsl(var(--success))"
              fillOpacity={1}
              fill="url(#colorEnrolled)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </MaterialCard>
  );
}
