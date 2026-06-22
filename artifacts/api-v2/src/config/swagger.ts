export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Grizzly Lounge API',
    version: '2.0.0',
    description: 'Профессиональный API для Grizzly Lounge',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Development server' },
    { url: 'https://api.grizzly-lounge.qmbox.ru', description: 'Production server' },
  ],
  paths: {
    '/api/v1/menu': {
      get: {
        summary: 'Получить все позиции меню',
        responses: {
          '200': {
            description: 'Список позиций меню',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/MenuItem' },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      MenuItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'string' },
          isActive: { type: 'integer' },
          outOfStock: { type: 'integer' },
        },
      },
    },
  },
};
