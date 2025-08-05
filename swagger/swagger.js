// ============================================
// swagger/swagger.js (CORREGIDO)
// ============================================
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Equipo 2 Tarde',
      description: 'Documentación de API con autenticación JWT + Cookies',
      version: '1.0.0',
      contact: {
        name: 'Equipo 2 Tarde',
        email: 'equipo2tarde@example.com'
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
            id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'Rol del usuario'
            },
            roleId: {
              type: 'string',
              description: 'ID del rol asignado'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del rol'
            },
            name: {
              type: 'string',
              description: 'Nombre del rol'
            },
            permission: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de permisos'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Log: {
          type: 'object',
          properties: {
            _id: {
            type: 'string',
            description: 'ID único del log'
          },
          title: {
          type: 'string',
          description: 'Título del error'
          },
          linkSentry: {
            type: 'string',
            description: 'Enlace al error en Sentry'
          },
          project: {
            type: 'string',
            description: 'Nombre del proyecto'
          },
          type: {
            type: 'string',
            enum: ['error', 'warning', 'info'],
            description: 'Estado de resolución'
          },
          status: {
            type: 'string',
            enum: ['solved', 'unresolved'],
            description: 'Tipo de estado del log'
          },
          platform: {
            type: 'string',
            description: 'Plataforma del sistema (por ejemplo: web, mobile)'
          },
          filename: {
            type: 'string',
            description: 'Nombre del archivo donde ocurrió el error'
          },
          function: {
            type: 'string',
            description: 'Función en la que ocurrió el error'
          },
          priority: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
            description: 'Nivel de prioridad'
          },
          count: {
            type: 'number',
            description: 'Cantidad de veces que ocurrió'
          },
          firstSeen: {
            type: 'string',
            format: 'date-time',
            description: 'Primera vez que se vio el error'
          },
          lastSeen: {
            type: 'string',
            format: 'date-time',
            description: 'Última vez que se vio el error'
          },
        },
        required: ['title', 'project', 'type', 'status']
      },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            error: {
              type: 'string',
              description: 'Detalle del error'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación'
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios'
      },
      {
        name: 'Roles',
        description: 'Gestión de roles'
      },
       {
        name: 'Logs',
        description: 'Gestión de logs'
      },
      {
        name: 'General',
        description: 'Endpoints generales'
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Equipo 2 Tarde - Documentación'
  }));

  // JSON docs
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📘 Documentación Swagger disponible en: http://localhost:3000/api-docs');
  console.log('📋 JSON Schema disponible en: http://localhost:3000/api-docs.json');
}

module.exports = swaggerDocs;

// ============================================
// .env (EJEMPLO)
// ============================================
/*
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambia_esto
NODE_ENV=development
*/

// ============================================
// package.json (COMPLETO)
// ============================================
/*
{
  "name": "api-equipo2-tarde",
  "version": "1.0.0",
  "description": "API con autenticación JWT y gestión de roles",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["api", "jwt", "express", "mongodb", "swagger"],
  "author": "Equipo 2 Tarde",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "pug": "^3.0.2",
    "http-errors": "^2.0.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
*/