const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    email: { type: 'string' },
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
          user: userSchema,
        },
      },
    },
  },
};
