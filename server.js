require("dotenv").config();
require("./instrument.js"); // Sentry lo más arriba posible

const app = require("./app");
require("./connections/db");

// Sentry.init({
//   dsn: "https://bc7acf8bf6c9695be588c2c31bfa3a6c@o4509752918540288.ingest.de.sentry.io/4509752919851088",
//   // Setting this option to true will send default PII data to Sentry.
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true,
//   environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || "development",
//   integrations: [
//     Sentry.captureConsoleIntegration({
//       levels: ["error", "warn", "info"],
//     }),
//   ],
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
});
