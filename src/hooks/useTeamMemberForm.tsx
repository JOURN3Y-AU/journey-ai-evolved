
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/components/admin/ImageUploadService';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;  // Required id
  name: string;
  position: string;
  bio: string;
  image_url: string;
  order?: number;
}

// Create a separate type for form data that can have optional id
export type TeamMemberFormData = Omit<TeamMember, 'id'> & { id?: string };

interface UseTeamMemberFormProps {
  member?: TeamMember;
  onSave: () => void;
}

export function useTeamMemberForm({ member, onSave }: UseTeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    position: '',
    bio: '',
    image_url: '',
    ...member
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (member?.image_url) {
      setImagePreview(member.image_url);
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if a new one is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Get the highest order value for new member
      let orderValue = formData.order || 0;
      if (!formData.order) {
        const { data: existingMembers, error: fetchError } = await supabase
          .from('team_members')
          .select('order')
          .order('order', { ascending: false })
          .limit(1) as any;
        
        if (fetchError) throw fetchError;
        
        orderValue = existingMembers && existingMembers.length > 0 
          ? (existingMembers[0].order + 1) 
          : 1;
      }

      const updatedMember = {
        ...formData,
        image_url: imageUrl,
        order: orderValue,
      };

      if (member?.id) {
        // Update existing member
        const { error: updateError } = await supabase
          .from('team_members')
          .update({
            name: updatedMember.name,
            position: updatedMember.position,
            bio: updatedMember.bio,
            image_url: updatedMember.image_url,
          })
          .eq('id', member.id) as any;
          
        if (updateError) throw updateError;
        
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
      } else {
        // Create new member
        const { error: insertError } = await supabase
          .from('team_members')
          .insert([{
            name: updatedMember.name,
            position: updatedMember.position,
            bio: updatedMember.bio,
            image_url: updatedMember.image_url,
            order: orderValue
          }]) as any;
          
        if (insertError) throw insertError;
        
        toast({
          title: "Success",
          description: "Team member added successfully",
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    imagePreview,
    isSubmitting,
    handleChange,
    handleImageChange,
    handleSubmit
  };
}
