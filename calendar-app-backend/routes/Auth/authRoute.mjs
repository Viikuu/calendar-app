import {
  createUser,
  authUser,
  getUser,
} from '../../controllers/authController.mjs';

import { createUserOpts, authUserOpts, getUserOpts } from './authOpts.mjs';

export const authRouter = async (fastify, opts, done) => {
  await fastify.get('/', getUserOpts, getUser); // check

  await fastify.post('/', createUserOpts, createUser); //register

  await fastify.post('/login', authUserOpts, authUser); //login

  done();
};
