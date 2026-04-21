'use strict';

/**
 * Lifecycle callbacks for the `single-news` model.
 */

module.exports = {
  async beforeCreate(event) {
    await preventTrendingNewsWithOtherCategories(event);
  },
  async beforeUpdate(event) {
    await preventTrendingNewsWithOtherCategories(event);
  }
};

/**
 * Helper function to prevent articles from having both Trending News and other categories
 * - Works with Strapi v4 relation input formats: array of ids, { set: [] }, or connect/disconnect
 * - Ensures primaryCategory is a non-trending category when available
 * - Computes canonicalPath = /c/<primaryCategory.slug>/<slug>
 */
async function preventTrendingNewsWithOtherCategories(event) {
  const { data, where } = event.params || {};
  if (!data) return;

  try {
    const strapi = global.strapi;

    // Load Trending News category id and slug
    const [trending] = await strapi.entityService.findMany('api::category.category', {
      filters: { name: 'Trending News' },
      fields: ['id', 'slug', 'name'],
    });
    const trendingId = trending?.id;

    // Normalize incoming categories into an array of numeric IDs
    const normalizeIds = (input) => {
      if (!input) return null;
      if (Array.isArray(input)) return input; // assuming array of ids
      if (typeof input === 'object') {
        if (Array.isArray(input.set)) return input.set;
        if (Array.isArray(input.connect)) return input.connect.map((c) => c.id).filter(Boolean);
      }
      return null;
    };

    let categoryIds = normalizeIds(data.categories);

    // If categories not present in payload but we need context, fetch current
    if (!categoryIds && (data.primaryCategory || trendingId)) {
      const id = where?.id || data.id;
      if (id) {
        const existing = await strapi.entityService.findOne('api::single-news.single-news', id, {
          populate: { categories: true, primaryCategory: true },
        });
        if (existing) {
          categoryIds = (existing.categories || []).map((c) => c.id);
          if (!data.slug && existing.slug) data.slug = existing.slug;
          if (!data.primaryCategory && existing.primaryCategory?.id) {
            data.primaryCategory = existing.primaryCategory.id;
          }
        }
      }
    }

    if (Array.isArray(categoryIds) && trendingId) {
      const hasTrending = categoryIds.includes(trendingId);
      const otherCategories = categoryIds.filter((id) => id !== trendingId);

      // If both trending and others are present, drop trending
      if (hasTrending && otherCategories.length > 0) {
        data.categories = { set: otherCategories };
      }

      // Ensure primaryCategory is not trending when others exist
      if (data.primaryCategory === trendingId && otherCategories.length > 0) {
        data.primaryCategory = otherCategories[0];
      }
    }

    // Compute canonicalPath when we have primaryCategory and slug
    const slug = data.slug;

    // If primaryCategory provided as object, normalize
    let primaryId = typeof data.primaryCategory === 'object' && data.primaryCategory?.set
      ? data.primaryCategory.set
      : data.primaryCategory;

    if (!primaryId) {
      // try derive from categories
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        primaryId = categoryIds[0];
      }
    }

    if (primaryId && slug) {
      const cat = await strapi.entityService.findOne('api::category.category', primaryId, { fields: ['slug'] });
      const catSlug = cat?.slug;
      if (catSlug) {
        data.canonicalPath = `/c/${catSlug}/${slug}`;
      }
    }
  } catch (error) {
    console.error('Error in lifecycle hook (single-news):', error);
  }
}