import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';

const fastify = Fastify({ logger: true });

await fastify.register(fastifyEnv, {
  dotenv: true,
  schema: {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: {
        type: 'string',
        default: 3000,
      },
    },
  },
});

fastify.get('/ping', async (request, reply) => {
  return { pong: 'it worked!' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
