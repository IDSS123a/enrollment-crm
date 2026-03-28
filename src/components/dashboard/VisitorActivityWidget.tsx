import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { MaterialCard } from './MaterialCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserCheck, 
  Calendar, 
  GraduationCap, 
  TrendingUp,
  ArrowRight,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VisitorStats {
  total: number;
  scheduled: number;
  visited: number;
  enrolled: number;
  conversionRate: string;
  thisMonth: number;
}

interface RecentVisitor {
  id: string;
  child_first_name: string;
  child_last_name: string;
  status: string;
  created_at: string;
  visit_date: string | null;
}

export function VisitorActivityWidget() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<VisitorStats>({
    total: 0,
    scheduled: 0,
    visited: 0,
    enrolled: 0,
    conversionRate: '0',
    thisMonth: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisitorData();
  }, []);

  const loadVisitorData = async () => {
    try {
      // Fetch all visitors
      const { data: visitors, error } = await supabase
        .from('visitors')
        .select('id, child_first_name, child_last_name, status, created_at, visit_date')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const visitorList = visitors || [];
      
      // Calculate stats
      const total = visitorList.length;
      const scheduled = visitorList.filter(v => v.status === 'scheduled').length;
      const visited = visitorList.filter(v => v.status === 'visited' || v.status === 'enrolled').length;
      const enrolled = visitorList.filter(v => v.status === 'enrolled').length;
      const conversionRate = visited > 0 ? ((enrolled / visited) * 100).toFixed(1) : '0';
      
      // This month count
      const now = new Date();
      const thisMonth = visitorList.filter(v => {
        const date = new Date(v.created_at);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length;

      setStats({ total, scheduled, visited, enrolled, conversionRate, thisMonth });
      setRecentVisitors(visitorList.slice(0, 5));
    } catch (error) {
      console.error('Failed to load visitor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      scheduled: { variant: 'outline', label: t('scheduled') },
      visited: { variant: 'secondary', label: t('visited') },
      enrolled: { variant: 'default', label: t('enrolledStatus') },
      rejected: { variant: 'destructive', label: t('rejected') },
      pending: { variant: 'outline', label: t('pending') },
    };
    
    const config = statusConfig[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <MaterialCard title={t('visitors')}>
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-muted-foreground">{t('loading')}</div>
        </div>
      </MaterialCard>
    );
  }

  return (
    <MaterialCard 
      title={t('visitors')}
      action={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/visitors" className="flex items-center gap-1 text-xs">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Mini Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <User className="h-4 w-4 text-primary mb-1" />
            <span className="text-lg font-semibold">{stats.total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 text-secondary mb-1" />
            <span className="text-lg font-semibold">{stats.scheduled}</span>
            <span className="text-[10px] text-muted-foreground">{t('scheduled')}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <GraduationCap className="h-4 w-4 text-green-500 mb-1" />
            <span className="text-lg font-semibold">{stats.enrolled}</span>
            <span className="text-[10px] text-muted-foreground">{t('enrolledStatus')}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 text-accent mb-1" />
            <span className="text-lg font-semibold">{stats.conversionRate}%</span>
            <span className="text-[10px] text-muted-foreground">Rate</span>
          </div>
        </div>

        {/* Recent Visitors List */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent Visitors
          </h4>
          {recentVisitors.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('noData')}
            </p>
          ) : (
            <div className="space-y-2">
              {recentVisitors.map((visitor) => (
                <Link
                  key={visitor.id}
                  to="/visitors"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {visitor.child_first_name} {visitor.child_last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(visitor.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(visitor.status)}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* This Month Badge */}
        {stats.thisMonth > 0 && (
          <div className="flex items-center justify-center pt-2 border-t border-border">
            <Badge variant="secondary" className="text-xs">
              +{stats.thisMonth} new this month
            </Badge>
          </div>
        )}
      </div>
    </MaterialCard>
  );
}
