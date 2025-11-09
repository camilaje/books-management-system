export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Books API',
    version: '1.0.0',
    description: 'API de gestión de libros con autenticación JWT',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Book: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'El Quijote' },
          author: { type: 'string', example: 'Miguel de Cervantes' },
          year: { type: 'integer', example: 1605 },
          status: { type: 'string', enum: ['available', 'reserved'], example: 'available' }
        },
        required: ['title','author','year']
      },
      CreateBookDto: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          author: { type: 'string' },
          year: { type: 'integer' },
          status: { type: 'string', enum: ['available', 'reserved'] }
        },
        required: ['title','author','year']
      },
      UpdateBookDto: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          author: { type: 'string' },
          year: { type: 'integer' },
          status: { type: 'string', enum: ['available', 'reserved'] }
        }
      },
      PaginatedBooks: {
        type: 'object',
        properties: {
          items: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 42 },
          pages: { type: 'integer', example: 5 }
        }
      },
      RegisterDto: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'admin@example.com' },
          password: { type: 'string', example: 'admin123' }
        },
        required: ['email','password']
      },
      LoginDto: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'admin@example.com' },
          password: { type: 'string', example: 'admin123' }
        },
        required: ['email','password']
      },
      TokenResponse: {
        type: 'object',
        properties: { token: { type: 'string', example: 'eyJhbGciOiJI...' } }
      },
      ErrorResponse: {
        type: 'object',
        properties: { error: { type: 'string' } }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterDto' } }
          }
        },
        responses: {
          '201': { description: 'Creado' },
          '400': { description: 'Error de validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginDto' } }
          }
        },
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } } } },
          '401': { description: 'Credenciales inválidas' }
        }
      }
    },
    '/api/books': {
      get: {
        tags: ['Books'],
        summary: 'Listar libros',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
          { in: 'query', name: 'q', schema: { type: 'string' }, description: 'Búsqueda por título/autor' },
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['available','reserved'] } },
          { in: 'query', name: 'sort', schema: { type: 'string' }, description: 'Ej: year,-title' }
        ],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedBooks' } } } }
        }
      },
      post: {
        tags: ['Books'],
        summary: 'Crear libro',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateBookDto' } } }
        },
        responses: {
          '201': { description: 'Creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
          '401': { description: 'No autorizado' }
        }
      }
    },
    '/api/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Obtener libro por id',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
          '404': { description: 'No encontrado' }
        }
      },
      put: {
        tags: ['Books'],
        summary: 'Actualizar libro',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateBookDto' } } } },
        responses: {
          '200': { description: 'Actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
          '401': { description: 'No autorizado' },
          '404': { description: 'No encontrado' }
        }
      },
      delete: {
        tags: ['Books'],
        summary: 'Eliminar libro',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          '204': { description: 'Eliminado' },
          '401': { description: 'No autorizado' },
          '404': { description: 'No encontrado' }
        }
      }
    }
  }
};
