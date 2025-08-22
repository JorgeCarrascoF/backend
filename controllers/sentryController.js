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
const crypto = require("crypto")

function generateHash(log) {
  const base = [
    log.culprit || "",
    log.error_type || "",
    log.environment || "",
    log.message || ""
  ].join("|");
  return crypto.createHash("sha1").update(base).digest("hex");
}

exports.handleSentryWebhook = async (req, res) => {
  try {
    console.log(
      "Webhook recibido desde Sentry:",
      JSON.stringify(req.body, null, 2)
    );

    const eventPayload = req.body?.data?.event || req.body.event;

    if (!eventPayload) {
      return res
        .status(400)
        .json({ msg: "Data missing in Sentry payload" });
    }

    // Buscar o crear Event relacionado
    let relatedLog = await Log.findOne({ issue_id: eventPayload.issue_id });

    let log;
    if (!relatedLog) {
      log = await Log.create({
        message: eventPayload.title || "",
        issue_id: eventPayload.issue_id || eventPayload.event_id,
        description: eventPayload.message || "",
        culprit: eventPayload.culprit || "",
        error_type: eventPayload.type || "error",
        environment: eventPayload.environment || "development",
        priority: "medium",
        assigned_to: "",
        status: "unresolved",
        created_at: new Date(),
        last_seen_at: new Date(),
        count: 1,
        active: true,
        userId: null,
        hash: generateHash({
          culprit: eventPayload.culprit,
          error_type: eventPayload.type,
          environment: eventPayload.environment,
        }),
        json_sentry: req.body,
      });
      console.log(`Log creado: ${log._id}`);
      res.status(201).json({
        msg: "Log created from Sentry webhook",
        log: log,
      });
    } else {
      log = await Log.findOneAndUpdate(
        { issue_id: eventPayload.issue_id },
        {
          $set: { last_seen_at: new Date() },
          $inc: { count: 1 },
        },
        { new: true }
      );
      console.log(`Log updated: ${log._id}`);
      res.status(200).json({
        msg: "Log updated from Sentry webhook",
        log: log,
      });
    }
  } catch (err) {
    console.error("Error processing Sentry webhook:", err);
    res
      .status(500)
      .json({ msg: "Error processing Sentry webhook", error: err.message });
  }
};
