import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AppRole } from '@/types/database';

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (!error && data) {
        setRoles(data.map(r => r.role as AppRole));
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  const isAdmin = roles.includes('admin');
  const isManager = roles.includes('manager') || isAdmin;
  const isUser = roles.includes('user');

  return { roles, isAdmin, isManager, isUser, loading };
}
