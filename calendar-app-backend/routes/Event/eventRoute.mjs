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

function parseEvent(events) {
  return events.map((el) => {
    return {
      title: el.title,
      description: el.description,
      color: el.color,
      _id: el._id.toString(),
    };
  });
}

export const eventRouter = async (fastify, opts, done) => {
  fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

  await fastify.get('/', getEventsOpts, async function gE(request, reply) {
    const eventsData = await getEvents(request, reply);
    return { events: eventsData };
  });

  await fastify.post('/', createEventsOpts, async function cE(request, reply) {
    const newEvent = await createEvent(request, reply);
    return {
      event: newEvent,
    };
  });

  await fastify.put(
    '/:id',
    updateEventsOpts,
    async function uE(request, reply) {
      const existingEvent = await updateEvent(request, reply);

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
      const deletedEvent = await deleteEvent(request, reply);

      if (!deletedEvent) {
        fastify.httpErrors.notFound('Event with given id not found!');
      }
      return { event: deletedEvent };
    },
  );

  done();
};
