import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  showHolidays: {
    type: Boolean,
  },
  showWeather: {
    type: Boolean,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  countryCode: {
    type: String,
  },
});

userSchema.plugin(uniqueValidator);

export const UserModel = mongoose.model('User', userSchema);
