// swagger/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Buggle - Equipo 2 Tarde',
      description: 'Documentación de API con autenticación JWT + Cookies',
      version: '1.0.0',
      contact: {
        name: 'Buggle',
        email: 'buggle@example.com'
      }
    },
    servers: [
      {
        url: "https://backend-llwm.onrender.com/api",
        description: 'Servidor de producción'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID único del usuario' },
            fullName: { type: 'string', description: 'Nombre completo del usuario' },
            username: { type: 'string', description: 'Nombre de usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            role: { type: 'string', enum: ['admin', 'user'], description: 'Rol del usuario' },
            roleId: { type: 'string', description: 'ID del rol asignado' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID único del rol' },
            name: { type: 'string', description: 'Nombre del rol' },
            permission: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista de permisos'
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Log: {
          type: 'object',
          required: ['message', 'event_id', 'sentry_timestamp', 'created_at', 'userId'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del log'
            },
            sentry_event_id: {
              type: 'string',
              description: 'ID del evento en Sentry'
            },
            event_id: {
              type: 'string',
              description: 'ID del evento interno'
            },
            message: {
              type: 'string',
              description: 'Mensaje del error o log'
            },
            link_sentry: {
              type: 'string',
              description: 'Enlace al error en Sentry'
            },
            culprit: {
              type: 'string',
              description: 'Causa principal del error'
            },
            filename: {
              type: 'string',
              description: 'Nombre del archivo donde ocurrió el error'
            },
            function_name: {
              type: 'string',
              description: 'Función donde ocurrió el error'
            },
            error_type: {
              type: 'string',
              enum: ['error', 'warning', 'info'],
              description: 'Tipo de error'
            },
            environment: {
              type: 'string',
              enum: ['staging', 'development', 'production'],
              description: 'Entorno de ejecución'
            },
            affected_user_ip: {
              type: 'string',
              description: 'IP del usuario afectado'
            },
            sentry_timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora original del evento en Sentry'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora en que se registró el log en el sistema'
            },
            userId: {
              type: 'string',
              description: 'ID del usuario que generó el log'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Mensaje de error' },
            error: { type: 'string', description: 'Detalle del error' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Endpoints de autenticación' },
      { name: 'Users', description: 'Gestión de usuarios' },
      { name: 'Roles', description: 'Gestión de roles' },
      { name: 'Logs', description: 'Gestión de logs' },
      { name: 'General', description: 'Endpoints generales' }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './docs/*.js' // Asegúrate de incluir esta línea
  ]
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Buggle - Documentación'
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📘 Documentación Swagger disponible en: http://localhost:3000/api-docs');
  console.log('📋 JSON Schema disponible en: http://localhost:3000/api-docs.json');
}

module.exports = swaggerDocs;
