
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
var suggestionRoutes = require('./routes/suggestion');

var documentRoutes = require('./routes/document');
var sentryRoutes = require('./routes/sentry');
var commentRoutes = require('./routes/comment');
var statusRegisterRoutes = require('./routes/status-register');
var suggestedUserRoutes = require('./routes/suggested-user');
var swaggerDocs = require('./swagger/swagger');
// const { credentials } = require('amqplib');
var urlRoutes = require('./routes/urlRoutes');
const bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://pruebas-concepto.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));


// Rutas principales
app.use('/', indexRouter);

// Rutas de API
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/logs', logsRoutes);

app.use('/api/suggestion', suggestionRoutes);

app.use('/api/documents', documentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/status-register', statusRegisterRoutes);
app.use('/api/suggested-user', suggestedUserRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/url', urlRoutes);

app.use('/api/webhook', sentryRoutes);

// Rutas CSS & images
app.use("/css", express.static("css"));
app.use("/images", express.static("images"));


app.use('/api/:projectId/envelope', bodyParser.text({ type: '*/*' }));


app.post('/api/:projectId/envelope', async (req, res) => {
  const projectId = req.params.sentry_key;
  
  console.log('🎯 Envelope recibido del SDK Sentry:', projectId);
  console.log("Params: ", req.params);

  console.log('Body recibido:' );
  console.log(req.body);

  // // El body es texto con varias líneas
  // const lines = req.body.split('\n').filter(Boolean);

  // try {
  //   const header = JSON.parse(lines[0]); // primera línea
  //   const itemHeader = JSON.parse(lines[1]); // segunda línea
  //   const payload = JSON.parse(lines[2]); // tercera línea (evento)
  //   console.log('Header:', header);
  //   console.log('Item header:', itemHeader);
  //   console.log("Payload:");
  //   console.dir(payload, { depth: null, colors: false, maxArrayLength: null });


  //   // TODO: validar public_key de header.dsn vs tu DB
  //   // TODO: guardar evento en tu DB

  //   res.status(200).send('OK');
  // } catch (err) {
  //   console.error('Error parseando envelope:', err);
  //   res.status(400).send('Bad Request');
  // }
  // try {
  //     // console.log(JSON.stringify(req.body, null, 2));
  
  //     const eventPayload = req.body?.data?.event || req.body.event;
  //     const issuePayload = req.body?.data?.issue || req.body.issue;
  
  //     if (!eventPayload && !issuePayload) {
  //       console.log("Webhook received without issue or event data");
  //       console.log(JSON.stringify(req.body?.data, null, 2));
  //       return res.status(400).json({ msg: "Data missing in Sentry payload" });
  //     }
  
  //     const payload = eventPayload || issuePayload;
  //     const isEvent = Boolean(eventPayload);
  
  //     const environment = normalizeEnvironment(payload.environment);
  //     const errorType = normalizeErrorType(payload.level);
  //     const priority = normalizePriority(payload.priority);
  
  //     const errorSignature = payload.metadata.type;
  
  //     const logHash = generateHash({
  //       culprit: payload.culprit,
  //       error_type: errorType,
  //       environment: environment,
  //       errorSignature: errorSignature,
  //       description: "",
  //     });
  
  //     let log = await Log.findOne({ hash: logHash });
  
  //     if (!log) {
  //       log = await Log.create({
  //         message: payload.title || "",
  //         issue_id: payload.issue_id || payload.id || payload.event_id,
  //         description: "",
  //         culprit: payload.culprit || "",
  //         error_type: errorType,
  //         environment: environment,
  //         priority: isEvent ? "medium" : priority,
  //         error_signature: errorSignature || "",
  //         assigned_to: "",
  //         status: "unresolved",
  //         created_at: new Date(),
  //         last_seen_at: new Date(),
  //         count: 1,
  //         active: true,
  //         userId: null,
  //         hash: generateHash({
  //           culprit: payload.culprit,
  //           error_type: errorType,
  //           environment: environment,
  //           errorSignature: errorSignature,
  //           description: "",
  //         }),
  //         json_sentry: req.body,
  //       });
  //       console.log(`Log created: ${log._id}: ${log.message}`);
  //       console.log(
  //         `Hash: ${log.hash} (${log.culprit}, "", ${log.error_type}, ${log.environment}, ${log.error_signature})`
  //       );
  
  //       return res.status(201).json({
  //         msg: "Log created from Sentry webhook",
  //         log: log,
  //       });
  //     }
  
  //     log = await Log.findOneAndUpdate(
  //       { hash: logHash },
  //       {
  //         $set: { last_seen_at: new Date() },
  //         $inc: { count: 1 },
  //       },
  //       { new: true }
  //     );
  //     console.log(`Log updated: ${log._id}: ${log.message} (${log.count})`);
  //     console.log(
  //       `Hash: ${log.hash} (${log.culprit}, "", ${log.error_type}, ${log.environment}, ${log.error_signature})`
  //     );
  //     return res.status(200).json({
  //       msg: "Log updated from Sentry webhook",
  //       log: log,
  //     });
  //   } catch (err) {
  //     console.error("Error processing Sentry webhook:", err);
  //     res
  //       .status(500)
  //       .json({ msg: "Error processing Sentry webhook", error: err.message });
  //   }
});

// Configurar Swagger
swaggerDocs(app);

// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//next(createError(404));
//});


// error handler
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);

app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    error: "Not Found",
    message: `Endpoint ${req.originalUrl} does not exist`
  });
});


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

  app.use(errorHandler);


});


module.exports = app;