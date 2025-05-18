
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    console.log("ImageUploadService: Starting upload for file:", file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `team_member_images/${fileName}`;
    
    console.log("ImageUploadService: Generated file path:", filePath);

    // Check if the user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("Authentication required for uploading images");
    }

    console.log("ImageUploadService: Uploading file to storage...");
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("ImageUploadService: Upload error:", error);
      throw error;
    }

    console.log("ImageUploadService: Upload successful:", data);
    
    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    const imageUrl = publicUrlData.publicUrl;
    console.log("ImageUploadService: Public URL:", imageUrl);
    
    return imageUrl;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
