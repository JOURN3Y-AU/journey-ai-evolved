
import { Input } from '@/components/ui/input';

interface BlogSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function BlogSearch({ searchQuery, setSearchQuery }: BlogSearchProps) {
  return (
    <div className="w-full md:w-64">
      <Input
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
