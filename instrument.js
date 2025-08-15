// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "https://a65bc44a10076d753ea318403e0cb269@o4509827685220352.ingest.us.sentry.io/4509827686400000",
    
    // Configuración de entorno
    environment: process.env.NODE_ENV || 'development',
    
    // Configuración de release
    release: process.env.APP_VERSION || '1.0.0',
    
    // Configuración de debug
    debug: process.env.NODE_ENV === 'development',
    
    // Configuración de beforeSend para capturar eventos localmente
    beforeSend(event, hint) {
        try {
            // Llamada no bloqueante al procesador local
            setImmediate(() => {
                try {
                    require('./services/sentryService').processSentryEvent(event, hint);
                } catch (err) {
                    // No re-lanzar, no romper el proceso si falla el procesador
                    console.error('Error en sentryService.processSentryEvent:', err);
                }
            });
        } catch (e) {
            console.error('beforeSend error:', e);
        }
        
        // Devuelve el evento para que Sentry prosiga su envío
        return event;
    },
    
    // Configuración de beforeSendTransaction para capturar transacciones
    beforeSendTransaction(event) {
        try {
            // Llamada no bloqueante para transacciones
            setImmediate(() => {
                try {
                    require('./services/sentryService').processSentryTransaction(event);
                } catch (err) {
                    console.error('Error en sentryService.processSentryTransaction:', err);
                }
            });
        } catch (e) {
            console.error('beforeSendTransaction error:', e);
        }
        
        return event;
    }
});

module.exports = Sentry;