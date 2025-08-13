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

const Log = require('../models/log');
const Event = require('../models/event');

exports.handleSentryWebhook = async (req, res) => {
    try {
        console.log('Webhook recibido desde Sentry:', JSON.stringify(req.body, null, 2));

        const sentryEventId = req.body?.data?.event?.event_id;
        const eventPayload = req.body?.data?.event;

        if (!sentryEventId || !eventPayload) {
            return res.status(400).json({ msg: 'Faltan datos en el payload de Sentry' });
        }

        // Buscar o crear Event relacionado
        let relatedEvent = await Event.findOne({ issue_id: eventPayload.issue_id });

        if (!relatedEvent) {
            relatedEvent = await Event.create({
                issue_id: eventPayload.issue_id,
                short_id: eventPayload.short_id || 'N/A',
                title: eventPayload.title,
                level: eventPayload.level || 'error',
                status: 'unresolved',
                count: eventPayload.count || 1,
                user_count: eventPayload.user_count || 0,
                is_unhandled: eventPayload.is_unhandled || false,
                created_at: new Date(),
                update_at: new Date()
            });
            console.log(`Event creado: ${relatedEvent._id}`);
        }

        // Crear el Log
        const newLog = await Log.create({
            sentry_event_id: sentryEventId,
            event_id: relatedEvent._id,
            message: eventPayload.title,
            link_sentry: eventPayload.web_url,
            culprit: eventPayload.culprit,
            filename: eventPayload.location,
            function_name: eventPayload.metadata?.function,
            error_type: eventPayload.type,
            environment: eventPayload.environment,
            affected_user_ip: eventPayload.user?.ip_address,
            sentry_timestamp: eventPayload.timestamp,
            created_at: new Date(),
            status: 'unresolved',
            json_sentry: req.body
        });

        res.status(201).json({
            msg: 'Log creado desde webhook de Sentry',
            log: newLog
        });

    } catch (err) {
        console.error('Error procesando webhook de Sentry:', err);
        res.status(500).json({ msg: 'Error procesando webhook de Sentry', error: err.message });
    }
};
