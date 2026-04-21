'use strict';

/**
 * single-news service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::single-news.single-news');
