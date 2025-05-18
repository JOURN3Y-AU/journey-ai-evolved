
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
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchSiteSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching site settings...');
      
      // Use a simpler query to avoid potential RLS issues
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'show_team_page');
        
      if (error) {
        // Handle no results found - not necessarily an error
        if (error.code === 'PGRST116') {
          console.log('No show_team_page setting found in the database');
          setShowTeamPage(true); // Default to showing the team page
        } else {
          console.error('Supabase error fetching site settings:', error);
          throw new Error(`Failed to fetch site settings: ${error.message}`);
        }
      } else if (data && data.length > 0) {
        console.log('Site setting found:', data[0]);
        // If we found data, use it
        setShowTeamPage(data[0].value === 'true');
      } else {
        // No data but also no error - default to showing
        console.log('No show_team_page setting found, defaulting to show');
        setShowTeamPage(true);
      }
    } catch (err: any) {
      console.error('Error in fetchSiteSettings:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Default to showing the team page in case of errors
      setShowTeamPage(true);
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
    error,
    refetchSettings: fetchSiteSettings
  };
}
