// const { processSentryWebhook } = require('../services/sentryProcessor');
// const Sentry = require('@sentry/node');

// async function handleSentryWebhook(req, res) {
//     try {
//         console.log('=== WEBHOOK SENTRY RECIBIDO ===');
//         console.log('Action:', req.body.action);
//         console.log('Event ID:', req.body.data?.event?.event_id);
//         console.log('Issue ID:', req.body.data?.event?.issue_id);

//         // Verificar que sea el tipo de webhook que manejamos
//         if (req.body.action !== 'triggered' || !req.body.data?.event) {
//             console.log('Webhook ignorado - tipo no soportado');
//             return res.status(200).json({
//                 message: 'Webhook received but not processed - unsupported type'
//             });
//         }

//         // Procesar el webhook
//         const result = await processSentryWebhook(req.body);

//         console.log('=== PROCESAMIENTO COMPLETADO ===');
//         console.log('Proyecto:', result.project?.name);
//         console.log('Evento ID:', result.event?.id);
//         console.log('Incidencia creada:', result.incident ? 'SÍ' : 'NO');

//         res.status(200).json({
//             success: true,
//             processed: {
//                 project_id: result.project.id,
//                 event_id: result.event.id,
//                 incident_created: !!result.incident,
//                 incident_code: result.incident?.code || null
//             }
//         });

//     } catch (error) {
//         console.error('=== ERROR EN WEBHOOK ===', error);

//         // Enviar el error del webhook también a Sentry
//         Sentry.captureException(error, {
//             tags: {
//                 section: 'webhook-processing',
//                 webhook_type: 'sentry'
//             },
//             extra: {
//                 webhook_payload: req.body,
//                 error_message: error.message
//             }
//         });

//         res.status(500).json({
//             error: 'Error processing webhook',
//             message: error.message
//         });
//     }
// }

// module.exports = {
//     handleSentryWebhook
// };

const Log = require("../models/log");
const crypto = require("crypto");

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

function normalizeErrorType(type) {
  const valid = ["error", "warning", "info"];
  return valid.includes(type) ? type : "error";
}

function normalizePriority(priority) {
  const valid = ["low", "medium", "high"];
  return valid.includes(priority) ? priority : "medium";
}

function normalizeEnvironment(env) {
  const valid = ["testing", "development", "production"];
  return valid.includes(env) ? env : "development";
}

exports.handleSentryWebhook = async (req, res) => {
  try {
    console.log("Log received from Sentry");
    // console.log(JSON.stringify(req.body, null, 2));

    const eventPayload = req.body?.data?.event || req.body.event;
    const issuePayload = req.body?.data?.issue || req.body.issue;

    if (!eventPayload && !issuePayload) {
      console.log("Webhook received without issue or event data");
      console.log(JSON.stringify(req.body?.data, null, 2));
      return res.status(400).json({ msg: "Data missing in Sentry payload" });
    }

    const payload = eventPayload || issuePayload;
    const isEvent = Boolean(eventPayload);

    const environment = normalizeEnvironment(payload.environment);
    const errorType = normalizeErrorType(payload.level);
    const priority = normalizePriority(payload.priority);

    const errorSignature = payload.metadata.type;

    const logHash = generateHash({
      culprit: payload.culprit,
      error_type: errorType,
      environment: environment,
      errorSignature: errorSignature,
      description: "",
    });

    let log = await Log.findOne({ hash: logHash });

    if (!log) {
      log = await Log.create({
        message: payload.title || "",
        issue_id: payload.issue_id || payload.id || payload.event_id,
        description: "",
        culprit: payload.culprit || "",
        error_type: errorType,
        environment: environment,
        priority: isEvent ? "medium" : priority,
        error_signature: errorSignature || "",
        assigned_to: "",
        status: "unresolved",
        created_at: new Date(),
        last_seen_at: new Date(),
        count: 1,
        active: true,
        userId: null,
        hash: generateHash({
          culprit: payload.culprit,
          error_type: errorType,
          environment: environment,
          errorSignature: errorSignature,
          description: "",
        }),
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
      { hash: logHash },
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
};
