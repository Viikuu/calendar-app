import mongoose, { Schema } from 'mongoose';

const countrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
});

export const CountryModel = mongoose.model('Country', countrySchema);
