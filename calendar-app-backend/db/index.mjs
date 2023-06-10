import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { getCountriesData } from '../routes/Country/countryRoute.mjs';

export const mongooseConn = fp(function mongooseConn(fastify, options, done) {
  (async () => {
    try {
      mongoose.connect(options.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const conn = mongoose.connection;

      await getCountriesData(fastify.config.HOLIDAY_API_KEY);
      console.log('Connected to db');
    } catch (error) {
      console.log(error.stack);
      console.log("Couldn't connect to db");
    }
  })();

  done();
});
