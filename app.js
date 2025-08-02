
// ============================================
// app.js (CORREGIDO)
// ============================================
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var createError = require('http-errors');

// Importar rutas
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
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

// Configurar Swagger
swaggerDocs(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  
  // Si es una petición API, responder con JSON
  if (req.path.startsWith('/api/')) {
    res.json({ error: err.message });
  } else {
    res.render('error');
  }
});

module.exports = app;