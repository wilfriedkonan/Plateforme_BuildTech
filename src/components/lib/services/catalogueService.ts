import { mockArticles, mockCategories, Article, Categorie } from '../mock/catalogue';

let articlesData = [...mockArticles];
let categoriesData = [...mockCategories];

export const catalogueService = {
  getCatalogueArticles: async (): Promise<Article[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return articlesData;
  },

  getCatalogueCategories: async (): Promise<Categorie[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return categoriesData;
  },

  toggleArticleVisibility: async (id: string): Promise<Article> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const articleIndex = articlesData.findIndex(a => a.id === id);
    if (articleIndex === -1) {
      throw new Error('Article not found');
    }

    articlesData[articleIndex] = {
      ...articlesData[articleIndex],
      visibleDansCatalogue: !articlesData[articleIndex].visibleDansCatalogue
    };

    return articlesData[articleIndex];
  },

  toggleCategoryVisibility: async (id: string): Promise<Categorie> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const categoryIndex = categoriesData.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    categoriesData[categoryIndex] = {
      ...categoriesData[categoryIndex],
      visibleDansCatalogue: !categoriesData[categoryIndex].visibleDansCatalogue
    };

    return categoriesData[categoryIndex];
  },

  getVisibleArticles: async (): Promise<Article[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return articlesData.filter(a => a.visibleDansCatalogue);
  },

  getVisibleCategories: async (): Promise<Categorie[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return categoriesData.filter(c => c.visibleDansCatalogue);
  }
};
