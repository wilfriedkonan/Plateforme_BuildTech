import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CatalogueCategory } from '../../hooks/useCatalogue';

interface CategoryCarouselProps {
  categories: CatalogueCategory[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white hover:bg-orange-50 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4 text-orange-500" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map(cat => (
          <button
            key={cat.idCategorie}
            onClick={() => onSelectCategory?.(cat.idCategorie)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap border ${
              selectedCategory === cat.idCategorie
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            {cat.nomCategorie}
            {cat.nombreArticles > 0 && (
              <span className={`ml-1.5 text-xs ${selectedCategory === cat.idCategorie ? 'text-orange-100' : 'text-gray-400'}`}>
                ({cat.nombreArticles})
              </span>
            )}
          </button>
        ))}
      </div>

      {canScrollRight && categories.length > 6 && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white hover:bg-orange-50 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4 text-orange-500" />
        </button>
      )}

      <style>{`
        .overflow-x-auto::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
