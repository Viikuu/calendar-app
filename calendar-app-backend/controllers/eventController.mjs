import xml2js from 'xml2js';
import { EventModel } from '../db/models/Events.mjs';
import { getUser } from './authController.mjs';

export async function getEvents(request, reply) {
  try {
    const eventData = await EventModel.find({
      userId: request.user._id,
    }).exec();

    return eventData;
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}

export async function getEventsByType(request, reply) {
  try {
    let eventData;
    if (request.params.type === '') {
      eventData = await EventModel.find({
        userId: request.user._id,
        type: request.params.type,
      }).exec();
    } else if (request.params.type === 'holiday') {
      const { countryCode = 'PL' } = await getUser(request, reply);

      eventData = await EventModel.find({
        location: countryCode,
        type: request.params.type,
      }).exec();
    } else if (request.params.type === 'weather') {
      const { city } = await getUser(request, reply);
      if (!city) {
        throw new Error('City not found!');
      }

      eventData = await EventModel.find({
        location: city,
        type: request.params.type,
      }).exec();
    } else {
      throw new Error('Type not found!');
    }

    return eventData;
  } catch (error) {
    throw new Error('Something went wrong! Try again');
  }
}

export async function createEvent(request, reply) {
  try {
    const { event } = request.body;
    const newEvent = new EventModel({
      userId: request.user._id,
      ...event,
    });
    return await newEvent.save();
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

export async function updateEvent(request, reply) {
  try {
    const { id } = request.params;
    const { event: eventData } = request.body;

    const existingEvent = await EventModel.findOneAndUpdate(
      {
        _id: id,
        userId: request.user._id,
      },
      { ...eventData },
      {
        new: true,
      },
    ).exec();
    return existingEvent;
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

export async function deleteEvent(request, reply) {
  try {
    const { id } = request.params;
    const deletedEvent = await EventModel.findOneAndDelete({
      _id: id,
      userId: request.user._id,
    }).exec();

    return deletedEvent;
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}

export async function getHolidays(fastify, request, reply) {
  try {
    const { countryCode = 'PL' } = await getUser(request, reply);

    const holidaysEvents = await EventModel.find({
      location: countryCode,
      type: 'holiday',
    }).exec();

    if (holidaysEvents.length === 0) {
      const { holidays: getHolidays } = await (
        await fetch(
          `https://holidayapi.com/v1/holidays?pretty&key=${
            fastify.config.HOLIDAY_API_KEY
          }&country=${countryCode}&year=${new Date().getFullYear() - 1}`,
        )
      ).json();

      getHolidays.filter((holiday) => !holiday.public);

      const getPublicHolidays = await (
        await fetch(
          `https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${countryCode}`,
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

      const holidays = await EventModel.insertMany(
        parsedHolidays.concat(parsedPublicHolidays),
      );
      return holidays;
    } else {
      return holidaysEvents;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

export async function getWeather(fastify, request, reply) {
  try {
    const { city = 'Lublin' } = await getUser(request, reply);
    if (!city) {
      return reply.code(404).send({ message: 'Users City not found!' });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const weatherEvents = await EventModel.find({
      location: city,
      type: 'weather',
      date: {
        $gte: today,
      },
    }).exec();

    if (weatherEvents.length < 6) {
      const geoLoc = await (
        await fetch(`https://geocode.maps.co/search?q={${city}}`)
      ).json();

      const xmlString = await (
        await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${geoLoc[0].lat}&lon=${geoLoc[0].lon}&mode=xml&appid=${fastify.config.WEATHER_API_KEY}`,
        )
      ).text();

      xml2js.parseString(xmlString, async (error, result) => {
        if (error) {
          console.error('Error parsing XML:', error);
        } else {
          let forecasts = [];
          result.weatherdata.forecast[0].time.forEach((forecast) => {
            forecasts.push({
              time: new Date(forecast.$.from),
              symbol: forecast.symbol[0].$.number,
              temperature: forecast.temperature[0].$.value,
            });
          });

          const resultFor = [];
          for (let i = 0; i < 6; i++) {
            const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
            const group = forecasts.filter(
              (forecast) => forecast.time.getDate() === date.getDate(),
            );
            const meanTemp = Math.round(
              group.reduce((a, b) => a + Number(b.temperature), 0) /
                group.length -
                273,
            );
            const mostSymbol = group
              .sort(
                (a, b) =>
                  group.filter((v) => v.symbol === a.symbol).length -
                  group.filter((v) => v.symbol === b.symbol).length,
              )
              .pop();
            resultFor.push({
              location: city,
              date: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              ),
              symbol: mostSymbol.symbol,
              temperature: meanTemp,
            });
          }
          const parsedWeather = resultFor.map((weather) => {
            return {
              title: weather.symbol,
              date: weather.date,
              location: city,
              color: '#009900',
              description: weather.temperature + '°C',
              type: 'weather',
            };
          });
          for (let weather of parsedWeather) {
            if (
              weatherEvents.some(
                (event) =>
                  event.date.getFullYear() === weather.date.getFullYear() &&
                  event.date.getMonth() === weather.date.getMonth() &&
                  event.date.getDate() === weather.date.getDate(),
              )
            ) {
              const newWeather = await EventModel.findOneAndUpdate(
                {
                  location: city,
                  type: 'weather',
                  date: weather.date,
                },
                { ...weather },
                {
                  new: true,
                },
              );
            } else {
              const newWeather = new EventModel({ ...weather });
              await newWeather.save();
            }
          }
        }
      });
      return await EventModel.find({
        location: city,
        type: 'weather',
        date: {
          $gte: new Date(),
        },
      }).exec();
    } else {
      return weatherEvents;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}
