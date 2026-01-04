import { Activity } from '@/types/database';
import { UserPlus, CheckCircle, Megaphone, Mail, Phone, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: Activity[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'user-plus': UserPlus,
  'check-circle': CheckCircle,
  'megaphone': Megaphone,
  'mail': Mail,
  'phone': Phone,
  'edit': Edit,
};

const typeColors: Record<string, string> = {
  lead: 'bg-info/10 text-info',
  conversion: 'bg-success/10 text-success',
  campaign: 'bg-primary/10 text-primary',
  contact: 'bg-secondary/10 text-secondary',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No recent activities
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = iconMap[activity.icon] || UserPlus;
        const colorClass = typeColors[activity.type] || typeColors.lead;
        
        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0 animate-fade-in"
          >
            <div className={`rounded-full p-2 flex-shrink-0 ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
