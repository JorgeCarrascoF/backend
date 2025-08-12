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

const crypto = require('crypto?');
const Log = require('../models/log');

const receiveSentryLog = async (req, res) => {
    try {
        const signature = req.headers['sentry web hook?'];
        const secret = process.env.SENTRY_WEBHOOK_SECRET;

        // Validar secret
        if (signature !== secret) {
            return res.status(403).json({ msg: 'Firma inválida. Acceso denegado.' });
        }

        const sentryEventId = req.body.data?.event?.event_id;
        if (!sentryEventId) {
            return res.status(400).json({ msg: 'No se recibió sentry_event_id válido.' });
        }

        const newLog = await Log.create({
            sentry_event_id: sentryEventId,
            message: req.body.data.event.title,
            link_sentry: req.body.data.event.web_url,
            culprit: req.body.data.event.culprit,
            filename: req.body.data.event.location,
            function_name: req.body.data.event.metadata?.function,
            error_type: req.body.data.event.type,
            environment: req.body.data.event.environment,
            affected_user_ip: req.body.data.event.user?.ip_address,
            sentry_timestamp: req.body.data.event.timestamp,
            status: 'unresolved',
            json_sentry: req.body
        });

        return res.status(201).json({ msg: 'Log recibido y guardado correctamente', log: newLog });

    } catch (err) {
        console.error('Error al recibir log de Sentry:', err);
        return res.status(500).json({ msg: 'Error procesando el log de Sentry', error: err.message });
    }
};

module.exports = { receiveSentryLog };
