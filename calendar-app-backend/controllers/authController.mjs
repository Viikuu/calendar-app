import bcrypt from 'bcrypt';
import { UserModel } from '../db/models/Users.mjs';
import fastify from '../server.mjs';

export async function createUser(request, reply) {
  try {
    const { email, password } = request.body;

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      password: hashedPass,
      email,
    });
    return await newUser.save();
  } catch {
    throw new Error('Something went wrong! Try again');
  }
}

export async function authUser(request, reply) {
  try {
    const { email, password } = request.body;
    const payload = await UserModel.findOne({
      email,
    }).exec();
    return payload;
  } catch (error) {
    console.log(error);
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
