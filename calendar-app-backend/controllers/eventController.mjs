import { EventModel } from '../db/models/Events.mjs';

export async function getEvents(request, reply) {
  try {
    const eventData = await EventModel.find({
      //userId: request.user._id,
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
      //userId,
      ...event,
    });
    return await newEvent.save();
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
        //userId,
      },
      event,
      {
        new: true,
      },
    ).exec();

    if (!existingEvent) {
      return null;
    }
    return existingEvent;
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}

export async function deleteEvent(request, reply) {
  try {
    const { id } = request.params;
    const deletedEvent = await EventModel.findOneAndDelete({
      _id: id,
      //userId,
    }).exec();

    if (!deletedEvent) {
      reply.code(404);
      return {};
    }
    return deletedEvent;
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}
