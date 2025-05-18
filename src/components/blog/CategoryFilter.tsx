
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button 
          key={category}
          variant={activeCategory === category ? "default" : "outline"} 
          size="sm"
          className={activeCategory === category 
            ? "bg-journey-purple hover:bg-journey-purple/90" 
            : "border-gray-200"
          }
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
