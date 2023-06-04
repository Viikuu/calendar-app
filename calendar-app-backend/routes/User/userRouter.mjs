import { updateUser } from '../../controllers/userController.mjs';

export const userRouter = async (fastify, opts, done) => {
  await fastify.put('/', async function setLoc(request, reply) {
    const { password, ...userData } = await updateUser(request, reply);

    return {
      user: {
        _id: userData._id,
        email: userData.email,
        city: userData.city,
        country: userData.country,
        options: userData.options,
      },
    };
  });

  done();
};
