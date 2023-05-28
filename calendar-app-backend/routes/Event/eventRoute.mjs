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

  await fastify.get('/', getEventsOpts, getEvents);

  await fastify.post('/', createEventsOpts, createEvent);

  await fastify.put('/:id', updateEventsOpts, updateEvent);

  await fastify.delete('/:id', deleteEventsOpts, deleteEvent);

  done();
};
