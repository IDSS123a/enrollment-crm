import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { getAvailableLanguages } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Palette, Globe, Bell, Save, Loader2 } from 'lucide-react';

export default function Settings() {
  const { profile, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const languages = getAvailableLanguages();
  
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile({ full_name: fullName });
      if (error) throw error;
      
      toast({ title: 'Success', description: t('saveSuccess') });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || t('saveError'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <MaterialCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-primary">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('profileSettings')}</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="gradient-primary">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('save')}
                </>
              )}
            </Button>
          </div>
        </MaterialCard>

        {/* Appearance Settings */}
        <MaterialCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-secondary">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('appearance')}</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t('darkMode')}</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </MaterialCard>

        {/* Language Settings */}
        <MaterialCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-info">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('language')}</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">{t('language')}</Label>
              <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </MaterialCard>

        {/* Notification Settings */}
        <MaterialCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-warning">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{t('notifications')}</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your leads and campaigns
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about new leads in real-time
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </MaterialCard>
      </div>
    </AppLayout>
  );
}
