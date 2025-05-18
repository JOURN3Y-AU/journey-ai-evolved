
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TeamPageSettings from './team/TeamPageSettings';
import TeamMembersList from './team/TeamMembersList';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface AdminTeamManagementProps {
  onLogout: () => void;
}

export default function AdminTeamManagement({ onLogout }: AdminTeamManagementProps) {
  const navigate = useNavigate();
  const { teamMembers, loading: loadingTeamMembers, refetchTeamMembers } = useTeamMembers();
  const { showTeamPage, loading: loadingSettings } = useSiteSettings();

  const loading = loadingTeamMembers || loadingSettings;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Team Management</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Dashboard
          </Button>
          
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <TeamPageSettings initialShowTeamPage={showTeamPage} />
          <TeamMembersList 
            initialMembers={teamMembers} 
            onRefresh={refetchTeamMembers} 
          />
        </>
      )}
    </div>
  );
}
