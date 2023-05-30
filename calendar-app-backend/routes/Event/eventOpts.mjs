const eventSchema = {
  _id: { type: 'string' },
  color: { type: 'string' },
  date: {
    type: 'string',
    format: 'date-time',
  },
  title: { type: 'string' },
  description: { type: 'string' },
};

export const getEventsOpts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: eventSchema,
            },
          },
        },
      },
    },
  },
};

export const createEventsOpts = {
  schema: {
    body: {
      type: 'object',
      required: ['event'],
      properties: {
        event: {
          type: 'object',
          properties: eventSchema,
        },
      },
    },

    response: {
      200: {
        type: 'object',
        properties: {
          event: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              ...eventSchema,
            },
          },
        },
      },
    },
  },
};

export const updateEventsOpts = {
  schema: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
      },
    },
    body: {
      type: 'object',
      required: ['event'],
      properties: {
        event: {
          type: 'object',
          properties: eventSchema,
        },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          event: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              ...eventSchema,
            },
          },
        },
      },
    },
  },
};

export const deleteEventsOpts = {
  schema: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          event: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              ...eventSchema,
            },
          },
        },
      },
    },
  },
};
