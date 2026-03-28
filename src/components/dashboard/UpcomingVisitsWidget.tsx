import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { MaterialCard } from './MaterialCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ArrowRight,
  Clock,
  MapPin,
  Video
} from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

interface UpcomingVisit {
  id: string;
  child_first_name: string;
  child_last_name: string;
  visit_date: string;
  visit_type: 'in_person' | 'online';
  visit_scheduled_at: string | null;
}

export function UpcomingVisitsWidget() {
  const { t } = useLanguage();
  const [visits, setVisits] = useState<UpcomingVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingVisits();
  }, []);

  const loadUpcomingVisits = async () => {
    try {
      const today = new Date();
      const nextWeek = addDays(today, 7);
      
      const { data, error } = await supabase
        .from('visitors')
        .select('id, child_first_name, child_last_name, visit_date, visit_type, visit_scheduled_at')
        .eq('status', 'scheduled')
        .gte('visit_date', format(today, 'yyyy-MM-dd'))
        .lte('visit_date', format(nextWeek, 'yyyy-MM-dd'))
        .order('visit_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Failed to load upcoming visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return { label: t('today'), className: 'bg-destructive text-destructive-foreground' };
    if (isTomorrow(date)) return { label: t('tomorrow'), className: 'bg-warning text-warning-foreground' };
    return { label: format(date, 'EEE, MMM d'), className: 'bg-muted text-muted-foreground' };
  };

  const formatTime = (scheduledAt: string | null) => {
    if (!scheduledAt) return null;
    try {
      // Handle both full datetime and time-only formats
      if (scheduledAt.includes('T') || scheduledAt.includes(' ')) {
        return format(new Date(scheduledAt), 'HH:mm');
      }
      // Handle time-only format like "14:30:00" or "14:30"
      return scheduledAt.substring(0, 5);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <MaterialCard title={t('upcomingVisits')}>
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-muted-foreground">{t('loading')}</div>
        </div>
      </MaterialCard>
    );
  }

  return (
    <MaterialCard 
      title={t('upcomingVisits')}
      action={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/visitors" className="flex items-center gap-1 text-xs">
            {t('viewAll')} <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-3">
        {visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t('noUpcomingVisits')}
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/visitors">{t('scheduleVisit')}</Link>
            </Button>
          </div>
        ) : (
          <>
            {visits.map((visit) => {
              const dateInfo = getDateLabel(visit.visit_date);
              const time = formatTime(visit.visit_scheduled_at);
              
              return (
                <Link
                  key={visit.id}
                  to="/visitors"
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {visit.visit_type === 'online' ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <MapPin className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {visit.child_first_name} {visit.child_last_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {time && (
                          <>
                            <Clock className="h-3 w-3" />
                            <span>{time}</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="capitalize">
                          {visit.visit_type === 'online' ? t('online') : t('inPerson')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={dateInfo.className}>
                    {dateInfo.label}
                  </Badge>
                </Link>
              );
            })}
            
            {visits.length > 0 && (
              <div className="flex items-center justify-center pt-2 border-t border-border">
                <Badge variant="outline" className="text-xs">
                  {visits.length} {visits.length === 1 ? 'visit' : 'visits'} this week
                </Badge>
              </div>
            )}
          </>
        )}
      </div>
    </MaterialCard>
  );
}
