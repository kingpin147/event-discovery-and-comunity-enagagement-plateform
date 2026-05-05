/**
 * rsvp controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::rsvp.rsvp', ({ strapi }) => ({
  async create(ctx) {
    // 1. Get user from context
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to RSVP');
    }

    // 2. Add user ID to request body
    ctx.request.body.data.user = user.id;

    // 3. Call default core controller logic
    const response = await super.create(ctx);
    return response;
  },

  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to view RSVPs');
    }

    // Force filtering by the current user
    ctx.query = {
      ...ctx.query,
      filters: {
        ...ctx.query.filters as any,
        user: user.id
      }
    };

    const response = await super.find(ctx);
    return response;
  }
}));
