import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from '../../controllers/eventController.mjs';

import {
  createEventsOpts,
  deleteEventsOpts,
  getEventsOpts,
  updateEventsOpts,
} from './eventOpts.mjs';

export const eventRouter = async (fastify, opts, done) => {
  fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

  await fastify.get('/', getEventsOpts, async function gE(request, reply) {
    const eventData = getEvents(request, reply);
    return { events: eventData };
  });

  await fastify.post('/', createEventsOpts, async function cE(request, reply) {
    const newEvent = createEvent(request, reply);
    return {
      event: newEvent,
    };
  });

  await fastify.put(
    '/:id',
    updateEventsOpts,
    async function uE(request, reply) {
      const existingEvent = updateEvent(request, reply);

      if (!existingEvent) {
        fastify.httpErrors.notFound('Event with given id not found!');
      }
      return { event: existingEvent };
    },
  );

  await fastify.delete(
    '/:id',
    deleteEventsOpts,
    async function dE(request, reply) {
      const deletedEvent = deleteEvent(request, reply);

      if (!deletedEvent) {
        fastify.httpErrors.notFound('Event with given id not found!');
      }
      return { event: deletedEvent };
    },
  );

  done();
};
