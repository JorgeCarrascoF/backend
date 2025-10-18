// ============================================
// app.js (CORREGIDO)
// ============================================
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var createError = require("http-errors");
const errorHandler = require("./middleware/errorHandler");
const Boom = require("@hapi/boom");

// Importar rutas
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var rolesRouter = require("./routes/roles");
var logsRoutes = require("./routes/logs");
var suggestionRoutes = require("./routes/suggestion");

var documentRoutes = require("./routes/document");
var sentryRoutes = require("./routes/sentry");
var commentRoutes = require("./routes/comment");
var statusRegisterRoutes = require("./routes/status-register");
var suggestedUserRoutes = require("./routes/suggested-user");
var swaggerDocs = require("./swagger/swagger");
// const { credentials } = require('amqplib');
var urlRoutes = require("./routes/urlRoutes");
const bodyParser = require("body-parser");
const Log = require("./models/log");
const crypto = require("crypto");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://pruebas-concepto.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));

// Rutas principales
app.use("/", indexRouter);

// Rutas de API
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/logs", logsRoutes);

app.use("/api/suggestion", suggestionRoutes);

app.use("/api/documents", documentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/status-register", statusRegisterRoutes);
app.use("/api/suggested-user", suggestedUserRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/url", urlRoutes);

app.use("/api/webhook", sentryRoutes);

// Rutas CSS & images
app.use("/css", express.static("css"));
app.use("/images", express.static("images"));

app.use("/api/:projectId/envelope", bodyParser.text({ type: "*/*" }));

function generateHash(log) {
  const base = [
    log.culprit || "",
    log.error_type || "",
    log.environment || "",
    log.description || "",
    log.errorSignature || "",
  ].join("|");
  return crypto.createHash("sha1").update(base).digest("hex");
}

app.post("/api/:projectId/envelope", async (req, res) => {
  const projectId = req.params.projectId;

  console.log("\n\n\n\n\n\n🎯 Envelope recibido del SDK Sentry:", projectId);
  console.log("Params: ", req.params);
  console.log("Headers", req.headers);
  console.log("Query:", req.query);

  console.log("Body recibido:");

  const lines = req.body.split("\n").filter(Boolean);
  const reqBody = [];

  lines.forEach((line, i) => {
    try {
      const parsedLine = JSON.parse(line);
      reqBody.push(parsedLine); // guardamos cada línea válida en el array
    } catch (err) {
      reqBody.push({
        error: `Línea ${i + 1} no es JSON válido`,
        content: line,
      });
    }
  });

  console.log("✅ Body parseado en reqBody:");
  console.dir(reqBody, { depth: null, colors: true, maxArrayLength: null });

  try {
    // NUEVA ESTRUCTURA DE UN LOG ----------------------

    const issue_id = req.query.sentry_key || "unknown_project_id"; // issue_id pasa a ser project_id, lo cogemos de la query.
    const errorSignature =
      reqBody[2].exception?.values[0].type || "UnknownError";
    const value =
      reqBody[2]?.exception?.values?.[0]?.value ??
      reqBody[2]?.message ??
      "unknown_message"; // Para evitar undefined

    const message = `${errorSignature}: ${value}`;
    const description = "";
    const culprit = reqBody[2].request.url || "unknown_culprit";
    const errorType = reqBody[2].level || "error";
    const environment = reqBody[2].environment || "production";
    const priority = "medium"; // No podemos conseguir la prioridad

    const hash = generateHash({
      culprit: culprit,
      error_type: errorType,
      environment: environment,
      errorSignature: errorSignature,
      description: "",
    });

    let log = await Log.findOne({ hash: hash });

    if (!log) {
      log = await Log.create({
        message: message,
        issue_id: issue_id,
        description: description,
        culprit: culprit,
        error_type: errorType,
        environment: environment,
        priority: priority,
        error_signature: errorSignature,
        assigned_to: "",
        status: "unresolved",
        created_at: new Date(),
        last_seen_at: new Date(),
        count: 1,
        active: true,
        userId: null,
        hash: hash,
        json_sentry: req.body,
      });
      console.log(`Log created: ${log._id}: ${log.message}`);
      console.log(
        `Hash: ${log.hash} (${log.culprit}, "", ${log.error_type}, ${log.environment}, ${log.error_signature})`
      );

      return res.status(201).json({
        msg: "Log created from Sentry webhook",
        log: log,
      });
    }

    log = await Log.findOneAndUpdate(
      { hash: hash },
      {
        $set: { last_seen_at: new Date() },
        $inc: { count: 1 },
      },
      { new: true }
    );
    console.log(`Log updated: ${log._id}: ${log.message} (${log.count})`);
    console.log(
      `Hash: ${log.hash} (${log.culprit}, "", ${log.error_type}, ${log.environment}, ${log.error_signature})`
    );
    return res.status(200).json({
      msg: "Log updated from Sentry webhook",
      log: log,
    });
  } catch (err) {
    console.error("Error processing Sentry webhook:", err);
    res
      .status(500)
      .json({ msg: "Error processing Sentry webhook", error: err.message });
  }

  res.status(200).send("OK");
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
    message: `Endpoint ${req.originalUrl} does not exist`,
  });
});

app.use((err, req, res, next) => {
  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode).json({
      statusCode: err.output.statusCode,
      error: err.output.payload.error,
      message: err.message,
      details: err.data?.details || null,
    });
  }

  res.status(500).json({
    statusCode: 500,
    error: "Internal Server Error",
    message: err.message,
  });

  app.use(errorHandler);
});

module.exports = app;
