import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export const mongooseConn = fp(function mongooseConn(fastify, options, done) {
  (async () => {
    try {
      await mongoose.connect(options.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to db');
    } catch (error) {
      console.log(error.message);
      console.log("Couldn't connect to db");
    }
  })();

  done();
});
