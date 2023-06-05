import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
  type: {
    type: String,
  },
  location: {
    type: String,
  },
});

export const EventModel = mongoose.model('Event', eventSchema);
