import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  LogOut,
  CheckCircle,
} from 'lucide-react';

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'leads', href: '/leads', icon: Users },
  { name: 'analytics', href: '/analytics', icon: BarChart3 },
  { name: 'campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const { t } = useLanguage();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col gradient-sidebar text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
          <span className="text-2xl font-bold">I</span>
        </div>
        <div>
          <h1 className="text-lg font-bold">IDSS Pro</h1>
          <p className="text-xs text-white/70">Enrollment CRM</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const translationKey = item.name as Parameters<typeof t>[0];
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {t(translationKey)}
            </Link>
          );
        })}
      </nav>

      {/* Sync Status */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-white/80">Cloud Synced</span>
        </div>
      </div>

      {/* User & Logout */}
      <div className="border-t border-white/10">
        {profile && (
          <div className="px-6 py-3 text-sm">
            <p className="font-medium text-white truncate">{profile.full_name || 'User'}</p>
            <p className="text-white/60 truncate text-xs">{profile.email}</p>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 px-6 py-4 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="h-5 w-5" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}
