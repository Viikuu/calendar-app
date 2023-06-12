import xml2js from 'xml2js';
import { EventModel } from '../db/models/Events.mjs';
import { getUser } from './authController.mjs';
import { CountryModel } from '../db/models/Country.mjs';
import { log } from 'console';

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
    const { country } = request.params;
    const { code: countryCode } = await CountryModel.findOne({ name: country });
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
      const tempConcatHolidays = parsedHolidays.concat(parsedPublicHolidays);

      const unique = tempConcatHolidays.filter(
        (obj, index) =>
          tempConcatHolidays.findIndex(
            (item) => item.title === obj.title && item.date === obj.date,
          ) === index,
      );
      const data = await EventModel.insertMany(unique);

      return unique;
    } else {
      return holidaysEvents;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

async function checkUserCity(request, reply) {
  try {
    const { city } = await getUser(request, reply);
    if (!city) {
      return reply.code(404).send({ message: 'Users City not found!' });
    } else {
      return city;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}
export async function getWeather(fastify, request, reply) {
  try {
    const city = await checkUserCity(request, reply);
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
      return await new Promise((resolve, reject) => {
        xml2js.parseString(xmlString, async (error, result) => {
          if (error) {
            return reject(error);
          }
          let forecasts = [];
          for (const forecast of result.weatherdata.forecast[0].time) {
            forecasts.push({
              time: new Date(forecast.$.from),
              symbol: forecast.symbol[0].$.number,
              temperature: forecast.temperature[0].$.value,
            });
          }

          const resultFor = [];
          for (let i = 0; i < 5; i++) {
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
          let newEvents = [];
          for (let weather of parsedWeather) {
            const newWeather = await EventModel.findOneAndUpdate(
              {
                location: city,
                type: 'weather',
                date: weather.date,
              },
              { ...weather },
              {
                new: true,
                upsert: true,
              },
            );
            newEvents.push(newWeather);
          }
          resolve(newEvents);
        });
      });
    } else {
      return weatherEvents;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

function genDay(i) {
  const currentDate = new Date();
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + i,
  );
}
function genDates() {
  const dates = [];
  for (let i = 1; i < 7; i++) {
    // Calculate the date by adding the current iteration index to the current date
    const date = genDay(i);

    // Generate hours from 6 to 20
    for (let hour = 6; hour <= 20; hour++) {
      const day = date.getDate();
      const formattedHour = hour;
      const dateObject = { day, hour: formattedHour };
      dates.push(dateObject);
    }
  }
  return dates;
}

function formatFreeDates(array) {
  function formatRange(start, end) {
    return start === end ? start.toString() : `${start}-${end}`;
  }
  function formatArr(nums) {
    let ranges = [];
    let start = nums[0];
    let end = nums[0];

    for (let i = 1; i < nums.length; i++) {
      if (nums[i] === end + 1) {
        end = nums[i];
      } else {
        if (start === end) {
          ranges.push(start.toString());
        } else {
          ranges.push(`${start}-${end}`);
        }
        start = nums[i];
        end = nums[i];
      }
    }

    if (start === end) {
      ranges.push(start);
    } else {
      ranges.push(`${start}-${end}`);
    }

    return ranges.join(', ');
  }

  let days = [];
  for (let i = 1; i < 7; i++) {
    // Calculate the date by adding the current iteration index to the current date
    const date = genDay(i);
    days.push(date.getDate());
  }

  return days
    .map((day) => {
      return {
        day,
        hours: formatArr(
          array.filter((date) => date.day === day).map((day) => day.hour),
        ),
      };
    })
    .filter((day) => day.hours !== '');
}

export async function getEventsTermins(request, reply) {
  try {
    const { type } = request.params;
    if (type === 'OutdoorSports' || type === 'IndoorSports') {
      const eventData = await EventModel.find({
        userId: request.user._id,
        date: {
          $gte: new Date(),
          $lte: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      }).exec();
      const dates = genDates();

      if (type === 'OutdoorSports') {
        const city = await checkUserCity(request, reply);
        const weatherEvents = await EventModel.find({
          location: city,
          type: 'weather',
          date: {
            $gte: new Date(),
          },
        }).exec();

        const getWeather = weatherEvents.filter(
          (weather) =>
            Number(
              weather.description.substring(0, weather.description.length - 2),
            ) > 15 &&
            Number(
              weather.description.substring(0, weather.description.length - 2),
            ) < 30 &&
            ['800', '801', '802', '803', '804'].some(
              (el) => el === weather.title,
            ),
        );
        const takenDates = eventData
          .filter((event) =>
            getWeather.some((el) => el.date.getDate() === event.date.getDate()),
          )
          .map((event) => {
            return { day: event.date.getDate(), hour: event.date.getHours() };
          });
        const freeDates = dates
          .filter((event) =>
            getWeather.some((el) => el.date.getDate() === event.day),
          )
          .filter(
            (date) =>
              !takenDates.some(
                (el) => el.day === date.day && el.hour === date.hour,
              ),
          );
        return formatFreeDates(freeDates);
      } else if (type === 'IndoorSports') {
        const takenDates = eventData.map((event) => {
          return { day: event.date.getDate(), hour: event.date.getHours() };
        });
        const freeDates = dates.filter(
          (date) =>
            !takenDates.some(
              (el) => el.day === date.day && el.hour === date.hour,
            ),
        );
        return formatFreeDates(freeDates);
      }
    } else if (type === 'Travel') {
      const { country } = await getUser(request, reply);
      const { code: countryCode } = await CountryModel.findOne({
        name: country,
      });
      const getPublicHolidays = await (
        await fetch(
          `https://date.nager.at/api/v3/LongWeekend/${new Date().getFullYear()}/${countryCode}`,
        )
      ).json();
      return getPublicHolidays;
    } else {
      return reply.code(404).send({ message: 'Type not found!' });
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

export async function createManyEvent(request, reply) {
  try {
    const { event, days } = request.body;
    const events = [];
    for (let i = 0; i < days; i++) {
      const newEvent = {
        userId: request.user._id,
        ...event,
        date: new Date(
          new Date(event.date).getTime() + i * 24 * 60 * 60 * 1000,
        ),
      };
      events.push(newEvent);
    }
    const newEvents = await EventModel.insertMany(events);
    return newEvents;
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}

export async function createRepetableEvent(request, reply) {
  try {
    const { event, repeatTimes, repetability } = request.body;
    const events = [];
    const date = new Date(event.date);
    console.log(repetability);
    console.log(repeatTimes);
    if (repetability === 'Weekly') {
      for (let i = 0; i < repeatTimes; i++) {
        const newEvent = {
          userId: request.user._id,
          ...event,
          date: new Date(
            new Date(event.date).getTime() + i * 7 * 24 * 60 * 60 * 1000,
          ),
        };
        events.push(newEvent);
      }
    } else if (repetability === 'Monthly') {
      for (let i = 0; i < repeatTimes; i++) {
        const newEvent = {
          userId: request.user._id,
          ...event,
          date: new Date(
            date.getFullYear(),
            date.getMonth() + i,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
          ),
        };
        events.push(newEvent);
      }
    } else if (repetability === 'Yearly') {
      for (let i = 0; i < repeatTimes; i++) {
        const newEvent = {
          userId: request.user._id,
          ...event,
          date: new Date(
            date.getFullYear() + i,
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
          ),
        };
        events.push(newEvent);
      }
    }
    console.log(events);
    const newEvents = await EventModel.insertMany(events);
    return newEvents;
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong! Try again');
  }
}
