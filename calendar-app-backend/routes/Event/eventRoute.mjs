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
      day: el.date.getDate(),
      month: el.date.getMonth(),
      year: el.date.getFullYear(),
      time: {
        hour: el.date.getHours(),
        minute: el.date.getMinutes(),
      },
    };
  });
}

export const eventRouter = async (fastify, opts, done) => {
  fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

  await fastify.get('/', getEventsOpts, async function gE(request, reply) {
    const eventData = await getEvents(request, reply);
    const events = parseEvent(eventData);
    console.log(events);
    return { events: events };
  });

  await fastify.post('/', createEventsOpts, async function cE(request, reply) {
    const newEvent = await createEvent(request, reply);
    const [event] = parseEvent([newEvent]);
    return {
      event: event,
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
      const [event] = parseEvent([existingEvent]);
      return { event: event };
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
      const [event] = parseEvent([deletedEvent]);
      return { event: event };
    },
  );

  done();
};
