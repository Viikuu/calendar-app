import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyJwt from '@fastify/jwt';
import { eventRouter } from './routes/Event/eventRoute.mjs';
import { mongooseConn } from './db/index.mjs';
const fastify = Fastify({ logger: true });

await fastify.register(fastifyEnv, {
  dotenv: true,
  schema: {
    type: 'object',
    required: ['PORT', 'SECRET'],
    properties: {
      DATABASE_HOST: {
        type: 'string',
        default:
          'mongodb+srv://user1234:user1234@db.lnb9c.mongodb.net/calendar?retryWrites=true&w=majority',
      },
      PORT: {
        type: 'string',
        default: 3000,
      },
      SECRET: {
        type: 'string',
        // gen by e.g. node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
        default:
          'bbde043a83739b21d74c82110cb9018e4ce0fab4a3ee4a99d6f032e779346227a2be4efb4735827d4b308ab12a3c7c8651b5db4ef3ef1826d952c870c8e9a493',
      },
    },
  },
});

fastify.register(mongooseConn, {
  uri: fastify.config.DATABASE_HOST,
});

fastify.register(fastifyJwt, {
  secret: fastify.config.SECRET,
});

fastify.register(async (fastify, opts, done) => {
  await fastify.register(eventRouter, { prefix: 'events' });

  await fastify.get('/ping', async (request, reply) => {
    return { pong: 'it worked!' };
  });

  done();
});

const start = async () => {
  try {
    await fastify.listen({ port: fastify.config.PORT });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
