import { EventModel } from '../db/models/Events.mjs';

export async function getEvents(request, reply) {
  try {
    const eventData = await EventModel.find({
      userId: request.user._id,
    }).exec();

    return eventData;
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
    return await newEvent.save();
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

export async function updateEvent(request, reply) {
  try {
    const { id } = request.params;
    const { event: eventData } = request.body;

    const existingEvent = await EventModel.findOneAndUpdate(
      {
        _id: id,
        userId: request.user._id,
      },
      { ...eventData },
      {
        new: true,
      },
    ).exec();
    return existingEvent;
  } catch (error) {
    console.log(error);
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

    return deletedEvent;
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}
