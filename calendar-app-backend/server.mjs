import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyAuth from '@fastify/auth';
import fastifySensible from '@fastify/sensible';
import cors from '@fastify/cors';
import { eventRouter } from './routes/Event/eventRoute.mjs';
import { mongooseConn } from './db/index.mjs';
import { authRouter } from './routes/Auth/authRoute.mjs';
import { countryRouter } from './routes/Country/countryRoute.mjs';

const fastify = Fastify({ logger: true });

fastify.register(fastifySensible);

fastify.register(cors, {
  origin: async () => true,
  credentials: true,
});

await fastify.register(fastifyEnv, {
  dotenv: true,
  schema: {
    type: 'object',
    required: [
      'PORT',
      'SECRET',
      'DATABASE_HOST',
      'HOLIDAY_API_KEY',
      'GEOCODING_API_URL',
      'WEATHER_API_KEY',
    ],
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
      HOLIDAY_API_KEY: {
        type: 'string', //https://holidayapi.com/v1/holidays?pretty&key=GEGSAGRGREGBEBGEBERGERGJHGJFHG&country=PL&year=2022
        default: 'https://holidayapi.com/v1/holidays?pretty&key=',
      },
      GEOCODING_API_URL: {
        type: 'string', //https://geocode.maps.co/search?q={Lublin,Polska}
        default: 'https://geocode.maps.co/search?q=',
      },
      WEATHER_API_KEY: {
        type: 'string',
        default: 'c1b3f1b3f1b3f1b3f1b3f1b3f1b3f1b3',
      },
    },
  },
});

fastify.register(mongooseConn, {
  uri: fastify.config.DATABASE_HOST,
});

fastify.register(fastifyAuth);

fastify.register(fastifyCookie);

fastify.register(fastifyJwt, {
  secret: fastify.config.SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
});

fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.register(async (fastify, opts, done) => {
  await fastify.register(authRouter, { prefix: 'auth' });

  await fastify.register(eventRouter, { prefix: 'events' });

  await fastify.register(countryRouter, { prefix: 'countries' });

  fastify.get('/ping', async (request, reply) => {
    return { pong: 'it worked!' };
  });

  done();
});

const start = async () => {
  try {
    await fastify.listen({
      port: fastify.config.PORT,
      host: '0.0.0.0',
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
