
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import BlogPostCard from './BlogPostCard';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  image_url: string;
  category: string;
}

interface BlogGridProps {
  loading: boolean;
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
}

export default function BlogGrid({
  loading,
  posts,
  totalPages,
  currentPage,
  setCurrentPage,
  setSearchQuery,
  setActiveCategory
}: BlogGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-journey-purple" />
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center p-12">
        <h3 className="text-2xl font-medium mb-4">No articles found</h3>
        <p className="text-gray-600 mb-6">Try different search terms or categories.</p>
        <Button 
          variant="outline"
          onClick={() => {
            setSearchQuery('');
            setActiveCategory('All');
          }}
        >
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                  className={currentPage === i + 1 ? "bg-journey-purple text-white hover:bg-journey-purple/90" : ""}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
