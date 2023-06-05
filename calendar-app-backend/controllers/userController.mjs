import { UserModel } from "../db/models/Users.mjs";

export async function updateUser(request, reply) {
  try {
    const userData = request.body;
    const { _doc: existingUser } = await UserModel.findByIdAndUpdate(
      { _id: request.user._id },
      userData,
      { new: true },
    ).exec();
    return existingUser;
  } catch (error) {
    throw new Error(`Something went wrong! Try again`);
  }
}
