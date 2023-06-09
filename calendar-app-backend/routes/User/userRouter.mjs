import { updateUser } from '../../controllers/userController.mjs';

export const userRouter = async (fastify, opts, done) => {
  fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

  await fastify.put('/', async function setLoc(request, reply) {
    const { city } = request.body;
    if (city) {
      const geoLoc = await (
        await fetch(`https://geocode.maps.co/search?q={${city}}`)
      ).json();
      if (geoLoc.length === 0) {
        throw fastify.httpErrors.badRequest('Invalid city name');
      }
    }
    const { password, ...userData } = await updateUser(request, reply);

    return {
      user: {
        _id: userData._id,
        email: userData.email,
        city: userData?.city,
        country: userData?.country,
        showHolidays: userData?.showHolidays,
        showWeather: userData?.showWeather,
      },
    };
  });

  done();
};
