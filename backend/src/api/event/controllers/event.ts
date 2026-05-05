/**
 * event controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to create an event');
    }

    // Assign the logged-in user as the organizer
    ctx.request.body.data.organizer = user.id;

    // Call the original create logic
    const response = await super.create(ctx);
    return response;
  }
}));
