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
    console.log(event);
    const date = new Date(
      event.year,
      event.month,
      event.day,
      event.time.hour,
      event.time.minute,
    );
    const newEvent = new EventModel({
      userId: request.user._id,
      date,
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
    const { event: data } = request.body;
    let eventData = {};
    if (request.body.event.time) {
      const date = new Date(
        data.year,
        data.month,
        data.day,
        data.time.hour,
        data.time.minute,
      );
      eventData = { ...eventData, date };
    } else if (request.body.event.title) {
      eventData = { ...eventData, title: request.body.event.title };
    } else if (request.body.event.description) {
      eventData = { ...eventData, description: request.body.event.description };
    } else if (request.body.event.color) {
      eventData = { ...eventData, color: request.body.event.color };
    }
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
