
  // === AUTH ===
  swaggerDocument.paths['/api/v1/auth/register'] = {
    post: { tags: ['Auth'], summary: 'Регистрация', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, password: { type: 'string' }, telegramId: { type: 'string' } }, required: ['username','password'] } } } }, responses: { '201': { description: 'JWT token + user' }, '409': { description: 'Username taken' } } }
  };
  swaggerDocument.paths['/api/v1/auth/login'] = {
    post: { tags: ['Auth'], summary: 'Вход', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, password: { type: 'string' } }, required: ['username','password'] } } } }, responses: { '200': { description: 'JWT token + user' }, '401': { description: 'Invalid credentials' } } }
  };
  swaggerDocument.paths['/api/v1/auth/me'] = {
    get: { tags: ['Auth'], summary: 'Текущий пользователь', security: [{ bearerAuth: [] }], responses: { '200': { description: 'User data' }, '401': { description: 'No token' } } }
  };
  swaggerDocument.components = swaggerDocument.components || {};
  swaggerDocument.components.securitySchemes = { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } };

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
