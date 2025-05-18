
import { useState, useEffect } from 'react';
import { uploadImage } from '@/components/admin/ImageUploadService';
import { useToast } from '@/hooks/use-toast';

interface UseImageUploadProps {
  initialImageUrl?: string;
}

export function useImageUpload({ initialImageUrl }: UseImageUploadProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

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

  const uploadImageIfNeeded = async (currentImageUrl: string): Promise<string> => {
    if (!imageFile) {
      return currentImageUrl;
    }
    
    setIsUploading(true);
    try {
      console.log("Uploading new image...");
      const uploadedImageUrl = await uploadImage(imageFile);
      console.log("Image uploaded successfully:", uploadedImageUrl);
      
      toast({
        title: "Image uploaded",
        description: "The image was uploaded successfully",
      });
      
      return uploadedImageUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageFile,
    imagePreview,
    isUploading,
    handleImageChange,
    uploadImageIfNeeded
  };
}
