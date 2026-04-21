'use strict';

/**
 * news-latter service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::news-latter.news-latter');
