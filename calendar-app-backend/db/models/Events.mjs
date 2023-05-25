import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export const EventModel = mongoose.model('Event', eventSchema);
