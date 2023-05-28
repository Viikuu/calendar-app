import bcrypt from 'bcrypt';
import { UserModel } from '../db/models/Users.mjs';
const { errorCodes } = 'fastify';
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
    const { _id, password, ...existingUser } = await UserModel.findOne({
      email,
    }).exec();
    if (!existingUser) {
      reply.code(errorCodes.FST_ERR_NOT_FOUND);
      return {};
    }
    const token = await reply.jwtSign({
      _id,
      email: existingUser.email,
    });

    reply
      .setCookie('token', token, {
        secure: false, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .code(200);
    return {
      user: existingUser,
    };
  } catch (error) {
    throw new Error(`Something went wrong! Try again`);
  }
}

export async function getUser(request, reply) {
  if (request.user) {
    try {
      const { _id, password, ...existingUser } = await UserModel.findById(
        request.user._id,
      ).exec();
      return {
        user: existingUser,
      };
    } catch (err) {
      console.log(err);
      throw new Error(`Something went wrong! Try again`);
    }
  } else {
    throw new Error('User is not logged in');
  }
}

export async function logout(request, reply) {
  if (request.user) reply.cookie('token', '');
  else {
    throw new Error('User already logged out');
  }
}
