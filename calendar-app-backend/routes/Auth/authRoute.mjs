import {
  createUser,
  authUser,
  getUser,
  logout,
} from '../../controllers/authController.mjs';

import { createUserOpts, authUserOpts, getUserOpts } from './authOpts.mjs';

export const authRouter = async (fastify, opts, done) => {
  await fastify.post('/', createUserOpts, createUser); //register

  await fastify.post('/login', authUserOpts, authUser); //login

  fastify.register(async (fastify, opts, done) => {
    fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

    await fastify.get('/', getUserOpts, getUser); // check

    await fastify.post('/logout', authUserOpts, logout);

    done();
  });

  done();
};
