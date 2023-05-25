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
  fastify.get('/', getEventsOpts, getEvents);

  fastify.post('/', createEventsOpts, createEvent);

  fastify.put('/:id', updateEventsOpts, updateEvent);

  fastify.delete('/:id', deleteEventsOpts, deleteEvent);

  done();
};
