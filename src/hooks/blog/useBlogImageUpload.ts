
import { useState } from 'react';
import { uploadImage } from '@/components/admin/ImageUploadService';

export function useBlogImageUpload(initialImageUrl: string = '') {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };
  
  const uploadImageIfNeeded = async (currentImageUrl: string): Promise<string> => {
    if (!imageFile) {
      return currentImageUrl;
    }
    
    try {
      const uploadedImageUrl = await uploadImage(imageFile);
      return uploadedImageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return {
    imagePreview,
    handleImageChange,
    handleImageRemove,
    uploadImageIfNeeded
  };
}
