'use strict';

/**
 * shorts service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::shorts.shorts');
