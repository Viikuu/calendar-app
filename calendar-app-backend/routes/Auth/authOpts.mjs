const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    email: { type: 'string' },
    city: { type: 'string' },
    country: { type: 'string' },
    showHolidays: { type: 'boolean' },
    showWeather: { type: 'boolean' },
  },
};

export const createUserOpts = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          user: userSchema,
        },
      },
    },
  },
};

export const authUserOpts = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          user: userSchema,
        },
      },
    },
  },
};

export const getUserOpts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          user: {
            ...userSchema,
          },
        },
      },
    },
  },
};
