
// ============================================
// app.js (CORREGIDO)
// ============================================
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var createError = require('http-errors');
const errorHandler = require('./middleware/errorHandler');
const Boom = require('@hapi/boom');


// Importar rutas
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var logsRoutes = require('./routes/logs')
var documentRoutes = require('./routes/document');
var sentryRoutes = require('./routes/sentry');
var eventsRouter = require('./routes/events');
var projectsRouter = require('./routes/projects');
var swaggerDocs = require('./swagger/swagger');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://pruebas-concepto.vercel.app', '*', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rutas principales
app.use('/', indexRouter);

// Rutas de API
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/logs', logsRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/events', eventsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/webhook', sentryRoutes);

// TODO: Hacer el endpoint funcional
app.post('/webhook/sentry', (req, res) => {
  console.log('🎯 Webhook recibido de Sentry:');
  console.log(JSON.stringify(req.body, null, 2)); // Muestra bonito
  res.status(200).send('OK');
});

// Configurar Swagger
swaggerDocs(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

// error handler
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);
  
//   // Si es una petición API, responder con JSON
//   if (req.path.startsWith('/api/')) {
//     res.json({ error: err.message });
//   } else {
//     res.render('error');
//   }
// });

app.use((err, req, res, next) => {
    if (Boom.isBoom(err)) {
        return res.status(err.output.statusCode).json({
            statusCode: err.output.statusCode,
            error: err.output.payload.error,
            message: err.message,
            details: err.data?.details || null
        });
    }

    res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: err.message
    });

    
});


module.exports = app;