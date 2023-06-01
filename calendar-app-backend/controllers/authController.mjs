import bcrypt from 'bcrypt';
import { UserModel } from '../db/models/Users.mjs';

export async function createUser(request, reply, fastify) {
  try {
    const { email, password } = request.body;

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      password: hashedPass,
      email,
    });
    return await newUser.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw fastify.httpErrors.badRequest('This email is already in use!');
    } else {
      throw new Error('Something went wrong! Try again');
    }
  }
}

export async function authUser(request, reply) {
  try {
    const { email } = request.body;
    const payload = await UserModel.findOne({
      email,
    }).exec();
    return payload;
  } catch (error) {
    throw new Error(`Something went wrong! Try again`);
  }
}

export async function getUser(request, reply) {
  try {
    const { _doc: existingUser } = await UserModel.findById(
      request.user._id,
    ).exec();
    return existingUser;
  } catch (err) {
    throw new Error(`Something went wrong! Try again`);
  }
}
