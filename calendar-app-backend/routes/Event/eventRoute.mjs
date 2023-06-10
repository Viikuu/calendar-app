import {
  createEvent,
  createManyEvent,
  createRepetableEvent,
  deleteEvent,
  getEvents,
  getEventsByType,
  getEventsTermins,
  getHolidays,
  getWeather,
  updateEvent,
} from '../../controllers/eventController.mjs';

import {
  createEventsOpts,
  deleteEventsOpts,
  getEventsByTypeOpts,
  getEventsOpts,
  getTypedEventsOpts,
  updateEventsOpts,
} from './eventOpts.mjs';

export const eventRouter = async (fastify, opts, done) => {
  fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

  await fastify.get('/', getEventsOpts, async function gE(request, reply) {
    const eventsData = await getEvents(request, reply);
    return { events: eventsData };
  });

  await fastify.get(
    '/getHolidays/:country',
    getTypedEventsOpts,
    async function cE(request, reply) {
      const newEvents = await getHolidays(fastify, request, reply);

      return {
        events: newEvents,
      };
    },
  );

  await fastify.get(
    '/getWeather',
    getTypedEventsOpts,
    async function cE(request, reply) {
      const newEvents = await getWeather(fastify, request, reply);
      return {
        events: newEvents,
      };
    },
  );

  await fastify.get(
    '/:type',
    getEventsByTypeOpts,
    async function gEbT(request, reply) {
      const eventsData = await getEventsByType(request, reply);
      return { events: eventsData };
    },
  );

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

  await fastify.post('/repetable', async function cE(request, reply) {
    const newEvents = await createRepetableEvent(request, reply);
    console.log(newEvents);
    return {
      events: newEvents,
    };
  });

  await fastify.post('/travel', async function cE(request, reply) {
    const newEvents = await createManyEvent(request, reply);
    return {
      events: newEvents,
    };
  });

  await fastify.get('/termin/:type', async function cE(request, reply) {
    const terms = await getEventsTermins(request, reply);
    return {
      termins: terms,
    };
  });

  done();
};
