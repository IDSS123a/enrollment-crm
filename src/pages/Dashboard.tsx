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

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
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

      // Generate sample chart data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setChartData(
        months.map((name, i) => ({
          name,
          leads: Math.floor(Math.random() * 50) + 20 + i * 5,
          conversions: Math.floor(Math.random() * 20) + 5 + i * 2,
        }))
      );
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

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t('totalLeads')}
            value={stats?.totalLeads.toLocaleString() || '0'}
            icon={<Users />}
            trend={{ value: '+12.5%', positive: true }}
          />
          <StatCard
            title={t('conversionRate')}
            value={`${stats?.conversionRate}%`}
            icon={<TrendingUp />}
            trend={{ value: '+2.1%', positive: true }}
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
            trend={{ value: '+8.3%', positive: true }}
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
                      boxShadow: 'var(--shadow-md)',
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

        {/* Lead Sources */}
        <div className="grid gap-6 md:grid-cols-2">
          <MaterialCard title={t('leadSources')}>
            <div className="space-y-4">
              {[
                { label: 'Website', value: 458, color: 'bg-primary' },
                { label: 'Social Media', value: 342, color: 'bg-secondary' },
                { label: 'Email Campaign', value: 287, color: 'bg-accent' },
                { label: 'Referral', value: 160, color: 'bg-success' },
              ].map((source) => (
                <div key={source.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{source.label}</span>
                    <span className="text-sm text-muted-foreground">{source.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${source.color} transition-all duration-500`}
                      style={{ width: `${(source.value / 458) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MaterialCard>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <MaterialCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/leads"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Users className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Add Lead</span>
              </a>
              <a
                href="/campaigns"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Megaphone className="h-6 w-6 text-secondary mb-2" />
                <span className="text-sm font-medium">New Campaign</span>
              </a>
            </div>
          </MaterialCard>
        </div>
      </div>
    </AppLayout>
  );
}
