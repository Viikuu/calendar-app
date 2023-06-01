import {
  createUser,
  authUser,
  getUser,
} from '../../controllers/authController.mjs';
import bcrypt from 'bcrypt';

import { createUserOpts, authUserOpts, getUserOpts } from './authOpts.mjs';

export const authRouter = async (fastify, opts, done) => {
  await fastify.post('/', createUserOpts, async function cU(request, reply) {
    const newUser = await createUser(request, reply, fastify);
    return {
      user: {
        _id: newUser._id,
        email: newUser.email,
      },
    };
  }); //register

  await fastify.post('/login', authUserOpts, async function aU(request, reply) {
    const { password } = request.body;
    const payload = await authUser(request, reply);
    if (!payload) {
      throw fastify.httpErrors.unauthorized();
    }

    const { _doc: existingUser } = payload;

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw fastify.httpErrors.unauthorized();
    }

    const token = await reply.jwtSign({
      _id: existingUser._id,
      email: existingUser.email,
    });

    reply
      .setCookie('token', token, {
        path: '/',
        signed: false,
        secure: false, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: 'strict', // alternative CSRF protection
      })
      .code(200);
    return {
      user: {
        _id: existingUser._id,
        email: existingUser.email,
      },
    };
  }); //login

  fastify.register(async (fastify, opts, done) => {
    fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

    await fastify.get('/', getUserOpts, async function gU(request, reply) {
      if (request.user) {
        const { password, ...userData } = await getUser(request, reply);
        return {
          user: {
            _id: userData._id,
            email: userData.email,
          },
        };
      } else {
        throw fastify.httpErrors.unauthorized();
      }
    }); // check

    await fastify.post(
      '/logout',
      authUserOpts,
      async function logout(request, reply) {
        if (request.user) {
          reply.setCookie('token', '', {
            path: '/',
            signed: false,
            secure: false, // send cookie over HTTPS only
            httpOnly: true,
            sameSite: 'strict', // alternative CSRF protection
          });
          return {};
        } else {
          throw fastify.httpErrors.methodNotAllowed('User already logged out!');
        }
      },
    );

    done();
  });

  done();
};
