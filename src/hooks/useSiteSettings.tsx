
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SiteSetting {
  key: string;
  value: string;
}

export function useSiteSettings() {
  const [showTeamPage, setShowTeamPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'show_team_page')
        .single() as { data: SiteSetting, error: any };
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching site settings:', error);
      } else if (data) {
        setShowTeamPage(data.value === 'true');
      }
    } catch (error) {
      console.error('Error in fetchSiteSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return {
    showTeamPage,
    loading,
    refetchSettings: fetchSiteSettings
  };
}
