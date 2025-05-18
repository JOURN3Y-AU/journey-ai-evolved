
import { useState } from 'react';
import { Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';

interface FeaturePostButtonProps {
  post: BlogPost;
  onToggleFeature: (id: string, newStatus: boolean) => void;
}

export default function FeaturePostButton({ post, onToggleFeature }: FeaturePostButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const toggleFeatured = async () => {
    setIsUpdating(true);
    try {
      // Get the current count of featured posts
      const { data: featuredPosts, error: countError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('featured_on_homepage', true);
      
      if (countError) throw countError;
      
      // If trying to feature a post and already have 3 featured posts, show error
      if (!post.featured_on_homepage && featuredPosts && featuredPosts.length >= 3) {
        toast({
          title: 'Cannot feature more posts',
          description: 'You can only have up to 3 posts featured on the homepage',
          variant: 'destructive',
        });
        return;
      }
      
      // Update the post's featured status
      const { error } = await supabase
        .from('blog_posts')
        .update({ featured_on_homepage: !post.featured_on_homepage })
        .eq('id', post.id);

      if (error) throw error;

      // Update the UI
      onToggleFeature(post.id, !post.featured_on_homepage);
      
      toast({
        title: post.featured_on_homepage ? 'Post unfeatured' : 'Post featured',
        description: `"${post.title}" is ${post.featured_on_homepage ? 'no longer featured' : 'now featured'} on the homepage`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={toggleFeatured}
      title={post.featured_on_homepage ? "Unfeature from homepage" : "Feature on homepage"}
      disabled={isUpdating}
    >
      {post.featured_on_homepage ? (
        <StarOff className="h-4 w-4" />
      ) : (
        <Star className="h-4 w-4" />
      )}
    </Button>
  );
}
