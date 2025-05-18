
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, TeamMemberFormData } from '@/types/teamMember';

// Check authentication status
export async function checkAuthStatus() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    throw new Error('Authentication required. Please log in again.');
  }
  return data.session;
}

// Get highest order value
export async function getHighestOrderValue(): Promise<number> {
  const { data, error } = await supabase
    .from('team_members')
    .select('order')
    .order('order', { ascending: false })
    .limit(1) as { data: { order: number }[], error: any };
  
  if (error) {
    console.error('Error fetching highest order value:', error);
    return 1; // Default to 1 if there's an error
  }
  
  return data && data.length > 0 ? data[0].order + 1 : 1;
}

// Update team member
export async function updateTeamMember(id: string, member: TeamMemberFormData): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .update(member)
    .eq('id', id)
    .select() as { data: TeamMember[], error: any };
  
  if (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
  
  return data[0];
}

// Create team member
export async function createTeamMember(member: TeamMemberFormData, order: number): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      ...member,
      order: order
    })
    .select() as { data: TeamMember[], error: any };
  
  if (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
  
  return data[0];
}
