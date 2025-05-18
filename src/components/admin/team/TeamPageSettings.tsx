
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeamPageSettingsProps {
  initialShowTeamPage: boolean;
}

export default function TeamPageSettings({ initialShowTeamPage }: TeamPageSettingsProps) {
  const [showTeamPage, setShowTeamPage] = useState(initialShowTeamPage);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleShowTeamToggle = async (value: boolean) => {
    setIsSaving(true);
    try {
      // Check if the setting exists
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'show_team_page') as any;
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update existing setting
        await supabase
          .from('site_settings')
          .update({ value: value ? 'true' : 'false' })
          .eq('key', 'show_team_page') as any;
      } else {
        // Insert new setting
        await supabase
          .from('site_settings')
          .insert([
            { key: 'show_team_page', value: value ? 'true' : 'false' }
          ]) as any;
      }
      
      setShowTeamPage(value);
      toast({
        title: "Success",
        description: `Team page is now ${value ? 'visible' : 'hidden'}`,
      });
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast({
        title: "Error",
        description: "Failed to update page visibility",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Page Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Switch 
            id="show-team-page" 
            checked={showTeamPage}
            disabled={isSaving}
            onCheckedChange={handleShowTeamToggle}
          />
          <Label htmlFor="show-team-page">
            {showTeamPage ? 'Team page is visible in navigation' : 'Team page is hidden from navigation'}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
