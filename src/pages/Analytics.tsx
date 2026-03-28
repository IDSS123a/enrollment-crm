import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, Award, Clock, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsData {
  totalRevenue: number;
  avgDealSize: number;
  winRate: number;
  salesCycle: number;
  revenueData: { month: string; revenue: number; target: number }[];
  funnelData: { stage: string; count: number; percentage: number }[];
  sourceData: { name: string; value: number }[];
}

const COLORS = ['hsl(280, 68%, 46%)', 'hsl(187, 100%, 42%)', 'hsl(16, 100%, 57%)', 'hsl(122, 39%, 49%)', 'hsl(207, 90%, 54%)'];

export default function Analytics() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    try {
      // Fetch leads for analytics
      const { data: leads } = await supabase.from('leads').select('*');
      const { data: campaigns } = await supabase.from('campaigns').select('*');

      const totalLeads = leads?.length || 0;
      const convertedLeads = leads?.filter((l) => l.status === 'converted').length || 0;
      const totalRevenue = campaigns?.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0) || 0;
      const avgDealSize = convertedLeads > 0 ? totalRevenue / convertedLeads : 0;
      const winRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Generate sample data
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueData = months.map((month, i) => ({
        month,
        revenue: Math.floor(Math.random() * 20000) + 30000 + i * 5000,
        target: 40000 + i * 2500,
      }));

      const funnelData = [
        { stage: 'Leads', count: totalLeads, percentage: 100 },
        { stage: 'Qualified', count: leads?.filter((l) => l.status !== 'new').length || 0, percentage: 68.6 },
        { stage: 'Proposal', count: leads?.filter((l) => l.status === 'qualified').length || 0, percentage: 33.9 },
        { stage: 'Negotiation', count: leads?.filter((l) => l.status === 'contacted').length || 0, percentage: 18.8 },
        { stage: 'Closed', count: convertedLeads, percentage: (convertedLeads / Math.max(totalLeads, 1)) * 100 },
      ];

      // Group by source
      const sourceMap = new Map<string, number>();
      leads?.forEach((lead) => {
        const source = lead.source || 'Direct';
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });
      const sourceData = Array.from(sourceMap, ([name, value]) => ({ name, value }));

      setData({
        totalRevenue,
        avgDealSize: Math.round(avgDealSize),
        winRate: parseFloat(winRate.toFixed(1)),
        salesCycle: 18,
        revenueData,
        funnelData,
        sourceData: sourceData.length > 0 ? sourceData : [{ name: 'No Data', value: 1 }],
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('analytics')}</h1>
            <p className="text-muted-foreground">Track your performance metrics</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'gradient-primary text-white'
                    : 'bg-card text-foreground hover:bg-muted shadow-material-sm'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`$${data?.totalRevenue.toLocaleString()}`}
            icon={<DollarSign />}
            gradient="primary"
          />
          <StatCard
            title="Avg Deal Size"
            value={`$${data?.avgDealSize.toLocaleString()}`}
            icon={<TrendingUp />}
          />
          <StatCard
            title="Win Rate"
            value={`${data?.winRate}%`}
            icon={<Award />}
            gradient="success"
          />
          <StatCard
            title="Sales Cycle"
            value={`${data?.salesCycle} days`}
            icon={<Clock />}
          />
        </div>

        {/* Charts */}
        <MaterialCard title="Revenue vs Target">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Revenue" />
                <Bar dataKey="target" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MaterialCard>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Funnel */}
          <MaterialCard title="Conversion Funnel">
            <div className="space-y-4">
              {data?.funnelData.map((stage, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">{stage.count.toLocaleString()}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-primary transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </MaterialCard>

          {/* Source Pie Chart */}
          <MaterialCard title="Lead Sources">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data?.sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </MaterialCard>
        </div>
      </div>
    </AppLayout>
  );
}
