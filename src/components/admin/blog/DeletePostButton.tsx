
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';

interface DeletePostButtonProps {
  post: BlogPost;
  onDelete: (id: string) => void;
}

export default function DeletePostButton({ post, onDelete }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setIsDeleting(true);
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', post.id);

        if (error) throw error;

        // Update the UI by removing the deleted post
        onDelete(post.id);
        
        toast({
          title: 'Post deleted',
          description: `"${post.title}" has been deleted successfully`,
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete the post',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="text-red-500 hover:text-red-700"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
