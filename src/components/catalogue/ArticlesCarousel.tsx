import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem } from './MenuItem';
import type { CatalogueArticle } from '../../hooks/useCatalogue';

interface ArticlesCarouselProps {
  articles: CatalogueArticle[];
  isLoading?: boolean;
  onAddToCart?: (article: CatalogueArticle) => void;
}

export const ArticlesCarousel: React.FC<ArticlesCarouselProps> = ({
  articles,
  isLoading,
  onAddToCart,
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
    el.scrollBy({ left: dir === 'left' ? -270 : 270, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [articles.length]);

  if (isLoading) {
    return (
      <div className="flex gap-4 py-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-shrink-0 w-52 h-64 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">
        Aucun article dans cette catégorie
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-6 z-20 p-2 bg-white hover:bg-orange-500 hover:text-white text-gray-700 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map(article => (
          <div key={article.idArticle} className="flex-shrink-0 w-52">
            <MenuItem article={article} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-6 z-20 p-2 bg-white hover:bg-orange-500 hover:text-white text-gray-700 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all"
          aria-label="Suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <style>{`
        .overflow-x-auto::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
