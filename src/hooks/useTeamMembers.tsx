
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/types/teamMember';

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching team members...');
      // Use a simpler query to avoid potential RLS issues
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order', { ascending: true });
        
      if (error) {
        console.error('Supabase error fetching team members:', error);
        throw new Error(`Failed to fetch team members: ${error.message}`);
      }
      
      console.log(`Fetched ${data?.length || 0} team members`);
      
      // Explicitly handle the TypeScript cast here
      const typedData = data as TeamMember[] | null;
      setTeamMembers(typedData || []);
    } catch (err: any) {
      console.error('Error in fetchTeamMembers:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Only show toast for non-network errors to avoid overwhelming users
      if (!(err.message && err.message.includes('network'))) {
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    refetchTeamMembers: fetchTeamMembers
  };
}
