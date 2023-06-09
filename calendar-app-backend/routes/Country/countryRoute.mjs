import { CountryModel } from '../../db/models/Country.mjs';
import { EventModel } from '../../db/models/Events.mjs';

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
        const newCountriesPayload = await (
          await fetch(`https://date.nager.at/api/v3/AvailableCountries`)
        ).json();

        const newCountries = newCountriesPayload.map((country) => {
          return {
            code: country.countryCode,
            name: country.name,
          };
        });
        const countries = await CountryModel.insertMany(newCountries);
        for (let country of countries) {
          const { holidays: getHolidays } = await (
            await fetch(
              `https://holidayapi.com/v1/holidays?pretty&key=${
                fastify.config.HOLIDAY_API_KEY
              }&country=${country.code}&year=${new Date().getFullYear() - 1}`,
            )
          ).json();
          getHolidays.filter((holiday) => !holiday.public);

          const getPublicHolidays = await (
            await fetch(
              `https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${
                country.code
              }`,
            )
          ).json();

          const parsedPublicHolidays = getPublicHolidays.map((holiday) => {
            return {
              title: holiday.name,
              date: new Date(holiday.date),
              color: '#009900',
              description: 'Public Holiday',
              type: 'holiday',
              location: holiday.countryCode,
            };
          });
          const parsedHolidays = getHolidays.map((holiday) => {
            return {
              title: holiday.name,
              date: new Date(
                holiday.date.substring(0, 3) +
                  (1 * holiday.date[3] + 1).toString() +
                  holiday.date.substring(3 + 1),
              ),
              color: '#009900',
              description: 'Holiday',
              type: 'holiday',
              location: holiday.country,
            };
          });
          const tempConcatHolidays =
            parsedHolidays.concat(parsedPublicHolidays);

          const unique = tempConcatHolidays.filter(
            (obj, index) =>
              tempConcatHolidays.findIndex(
                (item) => item.title === obj.title && item.date === obj.date,
              ) === index,
          );
          await EventModel.insertMany(unique);
        }
        return { countries };
      } else {
        return { countries };
      }
    },
  );

  done();
};
