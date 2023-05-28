import { EventModel } from '../db/models/Events.mjs';
const { errorCodes } = 'fastify';

export async function getEvents(request, reply) {
  try {
    const eventData = await EventModel.find({
      userId: request.user._id,
    }).exec();

    return { events: eventData };
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}

export async function createEvent(request, reply) {
  try {
    const { event } = request.body;
    const newEvent = new EventModel({
      userId: request.user._id,
      ...event,
    });
    return {
      event: await newEvent.save(),
    };
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}

export async function updateEvent(request, reply) {
  try {
    const { id } = request.params;
    const { event } = request.body;
    const existingEvent = await EventModel.findOneAndUpdate(
      {
        _id: id,
        userId: request.user._id,
      },
      event,
      {
        new: true,
      },
    ).exec();

    if (!existingEvent) {
      reply.code(errorCodes.FST_ERR_NOT_FOUND);
      return {};
    }
    return { event: existingEvent };
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}

export async function deleteEvent(request, reply) {
  try {
    const { id } = request.params;
    const deletedEvent = await EventModel.findOneAndDelete({
      _id: id,
      userId: request.user._id,
    }).exec();

    if (!deletedEvent) {
      reply.code(errorCodes.FST_ERR_NOT_FOUND);
      return {};
    }
    return { event: deletedEvent };
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}
