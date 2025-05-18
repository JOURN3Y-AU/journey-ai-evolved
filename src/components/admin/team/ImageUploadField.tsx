
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadFieldProps {
  imagePreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
}

export default function ImageUploadField({ imagePreview, onChange, isEdit }: ImageUploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">Profile Image</Label>
      <div className="flex items-center space-x-4">
        {imagePreview && (
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <Input 
          id="image"
          type="file"
          accept="image/*"
          onChange={onChange}
          className="max-w-sm"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {isEdit ? 'Upload a new image or keep the existing one' : 'Upload a profile image (square images work best)'}
      </p>
    </div>
  );
}
