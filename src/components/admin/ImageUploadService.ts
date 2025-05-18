
import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `blog-images/${fileName}`;
  
  // Check if the bucket exists, if not create it
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(bucket => bucket.name === 'blog-images')) {
    await supabase.storage.createBucket('blog-images', {
      public: true,
    });
  }

  // Upload the file
  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file);
    
  if (error) {
    throw error;
  }
  
  // Get public URL
  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
