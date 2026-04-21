'use strict';

/**
 * Backfill script for canonical URLs and primaryCategory
 * - Ensures each Category has a slug (uid of name)
 * - Ensures each News has a primaryCategory
 * - Ensures categories includes primaryCategory
 * - Computes canonicalPath = /c/<primaryCategory.slug>/<news.slug>
 *
 * Usage:
 *   STRAPI_URL=https://apicxotv.techplusmedia.com STRAPI_TOKEN=xxxxxxxx node scripts/backfill-canonical.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:3000';

// Resolve STRAPI_TOKEN with fallbacks: env > file (STRAPI_TOKEN_FILE or project-root/.strapi_token)
function resolveToken() {
  if (process.env.STRAPI_TOKEN) return process.env.STRAPI_TOKEN;
  const explicitFile = process.env.STRAPI_TOKEN_FILE;
  const defaultFile = path.join(process.cwd(), '.strapi_token');
  const candidate = explicitFile || defaultFile;
  try {
    if (fs.existsSync(candidate)) {
      const raw = fs.readFileSync(candidate, 'utf8');
      const token = raw.trim();
      if (token) return token;
    }
  } catch (_) {}
  return null;
}

const STRAPI_TOKEN = resolveToken();

if (!STRAPI_TOKEN) {
  console.error('[backfill-canonical] Missing STRAPI_TOKEN. Provide one of:');
  console.error('  - Environment:   STRAPI_TOKEN=<your-token>');
  console.error('  - Token file:    create a file at ./.strapi_token containing the token');
  console.error('  - Custom path:   set STRAPI_TOKEN_FILE=path/to/token.txt');
  process.exit(1);
}

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function paginateList(path, params = {}, pageSize = 100) {
  let page = 1;
  let results = [];
  while (true) {
    const res = await api.get(path, {
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        ...params,
      },
    });
    const items = res.data?.data || [];
    results = results.concat(items);
    const meta = res.data?.meta;
    if (!meta || page >= meta.pagination.pageCount) break;
    page += 1;
  }
  return results;
}

async function ensureCategorySlugs() {
  const categories = await paginateList('/categories', { populate: '*' });
  for (const cat of categories) {
    const name = cat.attributes?.name;
    const slug = cat.attributes?.slug;
    if (!slug && name) {
      const newSlug = slugify(name);
      try {
        await api.put(`/categories/${cat.id}`, { data: { slug: newSlug } });
      } catch (_) {}
    }
  }
}

async function buildCategorySlugMap() {
  const categories = await paginateList('/categories', { fields: ['slug','name'] });
  const map = new Map();
  for (const cat of categories) {
    map.set(cat.id, cat.attributes?.slug || slugify(cat.attributes?.name));
  }
  return map;
}

async function backfillNews(categorySlugMap) {
  const news = await paginateList('/news', { populate: 'categories,primaryCategory', 'fields[0]': 'slug' });
  for (const item of news) {
    const attrs = item.attributes || {};
    const slug = attrs.slug;
    let primaryCategoryId = attrs.primaryCategory?.data?.id;
    const categoryIds = (attrs.categories?.data || []).map((c) => c.id);

    if (!primaryCategoryId) {
      primaryCategoryId = categoryIds[0];
    }
    if (!primaryCategoryId || !slug) {
      // Cannot compute canonicalPath; skip
      continue;
    }

    // Ensure categories includes primary
    const mergedCategoryIds = Array.from(new Set([primaryCategoryId, ...categoryIds]));

    const catSlug = categorySlugMap.get(primaryCategoryId);
    const canonicalPath = catSlug ? `/c/${catSlug}/${slug}` : undefined;

    const data = {
      primaryCategory: primaryCategoryId,
      categories: mergedCategoryIds,
    };
    if (canonicalPath) data.canonicalPath = canonicalPath;

    try {
      await api.put(`/news/${item.id}`, { data });
    } catch (_) {}
  }
}

(async () => {
  try {
    console.log('Ensuring category slugs...');
    await ensureCategorySlugs();
    console.log('Building category slug map...');
    const map = await buildCategorySlugMap();
    console.log('Backfilling news primaryCategory and canonicalPath...');
    await backfillNews(map);
    console.log('Done.');
    process.exit(0);
  } catch (e) {
    console.error('Backfill failed', e);
    process.exit(1);
  }
})();
