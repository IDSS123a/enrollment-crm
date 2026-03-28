import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { VisitorActivityWidget } from '@/components/dashboard/VisitorActivityWidget';
import { UpcomingVisitsWidget } from '@/components/dashboard/UpcomingVisitsWidget';
import { VisitorConversionChart } from '@/components/dashboard/VisitorConversionChart';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Activity, DashboardStats, ChartDataPoint } from '@/types/database';
import { Users, TrendingUp, Megaphone, DollarSign, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

/** Lead source counts derived from real lead data */
interface LeadSourceStat {
  label: string;
  value: number;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSourceStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Fetch leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      // Fetch converted leads
      const { count: convertedLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'converted');

      // Fetch active campaigns
      const { count: activeCampaigns } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch total revenue from campaigns
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('revenue');

      const totalRevenue = campaignsData?.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0) || 0;

      // Calculate conversion rate
      const conversionRate = totalLeads && totalLeads > 0
        ? ((convertedLeads || 0) / totalLeads * 100).toFixed(1)
        : '0';

      setStats({
        totalLeads: totalLeads || 0,
        conversionRate: parseFloat(conversionRate),
        activeCampaigns: activeCampaigns || 0,
        revenue: totalRevenue,
        leadsThisMonth: 0,
        conversionsThisMonth: 0,
      });

      // Fetch recent activities
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setActivities((activitiesData || []) as Activity[]);

      // Build real chart data: leads per month for last 6 months
      const months: ChartDataPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const monthLabel = format(date, 'MMM');

        const { count: leadsCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        const { count: conversionsCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'converted')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        months.push({
          name: monthLabel,
          leads: leadsCount || 0,
          conversions: conversionsCount || 0,
        });
      }
      setChartData(months);

      // Build real lead sources from actual lead data
      const { data: allLeads } = await supabase
        .from('leads')
        .select('source');

      const sourceCounts: Record<string, number> = {};
      for (const lead of allLeads || []) {
        const src = lead.source || 'Direct';
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      }

      // Sort by count descending, take top 4
      const sourceColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success'];
      const sortedSources: LeadSourceStat[] = Object.entries(sourceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([label, value], i) => ({
          label,
          value,
          color: sourceColors[i] || 'bg-muted',
        }));

      setLeadSources(sortedSources);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Max value for lead sources bar widths
  const maxSourceValue = leadSources.length > 0 ? Math.max(...leadSources.map(s => s.value)) : 1;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t('totalLeads')}
            value={stats?.totalLeads.toLocaleString() || '0'}
            icon={<Users />}
          />
          <StatCard
            title={t('conversionRate')}
            value={`${stats?.conversionRate}%`}
            icon={<TrendingUp />}
            gradient="secondary"
          />
          <StatCard
            title={t('activeCampaigns')}
            value={stats?.activeCampaigns || '0'}
            icon={<Megaphone />}
          />
          <StatCard
            title={t('revenue')}
            value={`$${stats?.revenue.toLocaleString()}`}
            icon={<DollarSign />}
            gradient="success"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <MaterialCard title={t('performanceTrends')} className="lg:col-span-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MaterialCard>

          <MaterialCard title={t('recentActivity')}>
            <ActivityFeed activities={activities} />
          </MaterialCard>
        </div>

        {/* Visitor Activity & Upcoming Visits */}
        <div className="grid gap-6 md:grid-cols-2">
          <VisitorActivityWidget />
          <UpcomingVisitsWidget />
        </div>

        {/* Visitor Conversion Trends */}
        <div className="grid gap-6">
          <VisitorConversionChart />
        </div>

        {/* Lead Sources — real data */}
        <div className="grid gap-6 md:grid-cols-2">
          <MaterialCard title={t('leadSources')}>
            {leadSources.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('noData')}</p>
            ) : (
              <div className="space-y-4">
                {leadSources.map((source) => (
                  <div key={source.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{source.label}</span>
                      <span className="text-sm text-muted-foreground">{source.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${source.color} transition-all duration-500`}
                        style={{ width: `${(source.value / maxSourceValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MaterialCard>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <MaterialCard title={t('quickActions')}>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/leads"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Users className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">{t('addLead')}</span>
              </a>
              <a
                href="/campaigns"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Megaphone className="h-6 w-6 text-secondary mb-2" />
                <span className="text-sm font-medium">{t('addCampaign')}</span>
              </a>
            </div>
          </MaterialCard>
        </div>
      </div>
    </AppLayout>
  );
}
