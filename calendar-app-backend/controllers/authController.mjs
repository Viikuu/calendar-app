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
    const { email, password } = request.body;
    const { _doc: existingUser } = await UserModel.findOne({
      email,
    }).exec();

    if (!existingUser) {
      reply.code(errorCodes.FST_ERR_NOT_FOUND);
      return {};
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      reply.code(401);
      return {};
    }

    const token = await reply.jwtSign({
      _id: existingUser._id,
      email: existingUser.email,
    });

    reply
      .setCookie('token', token, {
        domain: 'localhost',
        path: '/',
        secure: false, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true, // alternative CSRF protection
      })
      .code(200);
    return {
      user: {
        _id: existingUser._id,
        email: existingUser.email,
      },
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Something went wrong! Try again`);
  }
}

export async function getUser(request, reply) {
  if (request.user) {
    try {
      const { _doc: existingUser } = await UserModel.findById(
        request.user._id,
      ).exec();
      const { password, ...userData } = existingUser;
      return {
        user: userData,
      };
    } catch (err) {
      throw new Error(`Something went wrong! Try again`);
    }
  } else {
    throw new Error('User is not logged in');
  }
}

export async function logout(request, reply) {
  if (request.user)
    reply.setCookie('token', '', {
      domain: 'localhost',
      path: '/',
      secure: false, // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true, // alternative CSRF protection
    });
  else {
    throw new Error('User already logged out');
  }
}
