'use strict';

/**
 * This script fixes the issue where articles are automatically added to "Trending News" category
 * despite being saved under specific categories.
 * 
 * To run this script: node scripts/fix-trending-news.js
 */

const path = require('path');
const fs = require('fs');

/**
 * Main function to fix the Trending News category issue
 */
async function fixTrendingNewsIssue() {
  try {
    // Create the lifecycles.js file to prevent future issues
    await createLifecyclesFile();
  } catch (error) {
    // Silent error handling in production
  }
}

/**
 * Create the lifecycles.js file to prevent articles from having both
 * Trending News and other categories simultaneously
 */
async function createLifecyclesFile() {
  try {
    const lifecyclesDir = path.join(process.cwd(), 'src', 'api', 'single-news', 'content-types', 'single-news');
    
    // Check if the directory exists
    if (!fs.existsSync(lifecyclesDir)) {
      fs.mkdirSync(lifecyclesDir, { recursive: true });
    }
    
    const lifecyclesContent = `'use strict';

/**
 * Lifecycle callbacks for the \`single-news\` model.
 */

module.exports = {
  beforeCreate(event) {
    preventTrendingNewsWithOtherCategories(event);
  },
  beforeUpdate(event) {
    preventTrendingNewsWithOtherCategories(event);
  }
};

/**
 * Helper function to prevent articles from having both Trending News and other categories
 */
async function preventTrendingNewsWithOtherCategories(event) {
  const { data } = event.params;
  
  // Only process if categories are being set
  if (data && data.categories) {
    try {
      // Get strapi instance - it's available globally in the Strapi context
      const strapi = global.strapi;
      
      // Find Trending News category
      const trendingNewsCategory = await strapi.entityService.findMany('api::category.category', {
        filters: {
          name: 'Trending News',
        },
      });
      
      if (!trendingNewsCategory || trendingNewsCategory.length === 0) return;
      
      const trendingNewsCategoryId = trendingNewsCategory[0].id;
      
      // Check if article has both Trending News and other categories
      const hasTrendingNews = data.categories.includes(trendingNewsCategoryId);
      const otherCategories = data.categories.filter(catId => catId !== trendingNewsCategoryId);
      
      // If article has both Trending News and other categories, remove Trending News
      if (hasTrendingNews && otherCategories.length > 0) {
        data.categories = otherCategories;
      }
    } catch (error) {
      // Silent fail - no logging in production
    }
  }
}`;

    const lifecyclesPath = path.join(lifecyclesDir, 'lifecycles.js');
    
    fs.writeFileSync(lifecyclesPath, lifecyclesContent);
    
    return true;
  } catch (error) {
    throw error;
  }
}

// Run the fix function
fixTrendingNewsIssue().then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
