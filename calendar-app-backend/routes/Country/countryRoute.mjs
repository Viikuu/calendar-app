import { CountryModel } from '../../db/models/Country.mjs';

export const countryRouter = async (fastify, opts, done) => {
  fastify.addHook('onRequest', fastify.auth([fastify.authenticate]));

  await fastify.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              countries: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async function getCountries() {
      async function getCountries() {
        try {
          const countries = await CountryModel.find().exec();
          return countries;
        } catch (error) {
          throw new Error(`Something went wrong! Try again`);
        }
      }

      const countries = await getCountries();
      if (countries.length === 0) {
        const { countries: newCountriesPayload } = await (
          await fetch(
            `https://holidayapi.com/v1/countries?pretty&key=${fastify.config.HOLIDAY_API_KEY}`,
          )
        ).json();

        const newCountries = newCountriesPayload.map((country) => {
          return { code: country.code, name: country.name };
        });

        const countries = await CountryModel.insertMany(newCountries);
        return { countries };
      } else {
        return { countries };
      }
    },
  );

  done();
};
