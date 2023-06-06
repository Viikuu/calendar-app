import { CountryModel } from '../db/models/Country.mjs';
import { UserModel } from '../db/models/Users.mjs';

export async function updateUser(request, reply) {
  try {
    const { city, country, showHolidays, showWeather } = request.body;
    let parsedUserData = {};
    if (city) {
      parsedUserData['city'] = city;
    }

    if (country) {
      const { code } = await CountryModel.find({ name: country });
      parsedUserData['countryCode'] = code;
      parsedUserData['country'] = country;
    }

    if (showHolidays) {
      parsedUserData['showHolidays'] = showHolidays;
    }

    if (showWeather) {
      parsedUserData['showWeather'] = showWeather;
    }
    const { _doc: existingUser } = await UserModel.findByIdAndUpdate(
      { _id: request.user._id },
      parsedUserData,
      { new: true },
    ).exec();
    return existingUser;
  } catch (error) {
    )
    throw new Error(`Something went wrong! Try again`);
  }
}
