// services/sentryService.js
const mongoose = require('mongoose');
const Log = require('../models/log');

class SentryService {
    /**
     * Entry point: procesa evento Sentry (invocado desde beforeSend)
     * @param {Object} event
     * @param {Object} hint
     */
    async processSentryEvent(event, hint = {}) {
        try {
                console.log('🔄 [SENTRY] Procesando evento:', {
                eventId: event.event_id,
                message: event.message,
                level: event.level,
                timestamp: new Date().toISOString()
            });
            const eventData = this.extractEventData(event, hint);
            await this.createLogFromSentry(eventData);
            await this.processMetrics(eventData);
            console.log(`✅ Evento Sentry procesado: ${eventData.message}`);
        } catch (err) {
            console.error('❌ Error procesando evento Sentry:', err);
            // no re-lanzar
        }
    }

    async processSentryTransaction(transaction) {
        try {
            const transactionData = this.extractTransactionData(transaction);
            await this.createTransactionLog(transactionData);
            console.log(`✅ Transacción Sentry procesada: ${transactionData.operation}`);
        } catch (err) {
            console.error('❌ Error procesando transacción Sentry:', err);
        }
    }

    extractEventData(event, hint = {}) {
        const eventId = event.event_id || (hint && hint.event_id) || null;
        const message =
            event.message ||
            (event.exception && event.exception.values && event.exception.values[0] && event.exception.values[0].value) ||
            'Error sin mensaje';
        const level = event.level || 'error';
        const culprit = event.culprit || '';
        const timestamp = event.timestamp ? new Date(event.timestamp * 1000) : new Date();
        const tags = this.extractTags(event);
        const user = event.user || {};
        const request = event.request || {};

        return {
            eventId,
            message,
            level,
            culprit,
            timestamp,
            tags,
            user,
            request,
            platform: event.platform,
            sdk: event.sdk,
            contexts: event.contexts,
            raw: event
        };
    }

    extractTransactionData(transaction) {
        return {
            operation: transaction.transaction || 'unknown',
            duration: transaction.duration,
            status: transaction.status,
            timestamp: new Date(),
            tags: this.extractTags(transaction),
            raw: transaction
        };
    }

    extractTags(event) {
        const tags = {};
        if (!event) return tags;
        if (event.tags) {
            if (Array.isArray(event.tags)) {
                // [[key, value], ...] or [{key, value}, ...]
                for (const t of event.tags) {
                    if (Array.isArray(t) && t.length >= 2) tags[t[0]] = t[1];
                    else if (t && t.key) tags[t.key] = t.value;
                }
            } else if (typeof event.tags === 'object') {
                Object.assign(tags, event.tags);
            }
        }
        // also support event.environment
        if (event.environment) tags.environment = event.environment;
        return tags;
    }

    extractFrameInfo(rawEvent) {
        try {
            const exc = rawEvent?.exception?.values?.[0];
            const frames = exc?.stacktrace?.frames;
            if (!frames || !frames.length) return {};
            // elegir frame más relevante: último frame (más cercano al error) o el primero según preferencia
            const frame = frames[frames.length - 1] || frames[0];
            return {
                filename: frame?.filename || frame?.abs_path || '',
                functionName: frame?.function || frame?.symbol || ''
            };
        } catch (e) {
            return {};
        }
    }

    mapToSchemaErrorType(sentryLevel) {
        switch ((sentryLevel || '').toLowerCase()) {
            case 'fatal':
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
            case 'debug':
                return 'info';
            default:
                return 'error';
        }
    }

    buildSentryLink(eventData) {
        try {
            const org = eventData.tags?.organization || eventData.tags?.org || eventData.tags?.organization_slug;
            const proj = eventData.tags?.project || eventData.tags?.project_slug;
            const id = eventData.eventId;
            if (org && proj && id) {
                // URL genérica (ajusta si usas self-hosted)
                return `https://sentry.io/organizations/${org}/issues/?project=${proj}&query=${id}`;
            }
            return '';
        } catch (e) {
            return '';
        }
    }

    // Trunca/filtra json_sentry para evitar payloads enormes
    sanitizeRaw(raw) {
        try {
            if (!raw) return {};
            // Guardar solo campos útiles y evitar guardar todo si es muy grande
            const subset = {
                exception: raw.exception,
                message: raw.message,
                platform: raw.platform,
                level: raw.level,
                culprit: raw.culprit,
                tags: raw.tags,
                user: raw.user,
                request: raw.request,
                contexts: raw.contexts,
                breadcrumbs: raw.breadcrumbs
            };
            const json = JSON.stringify(subset);
            // limitar a 200KB (ajustable)
            if (Buffer.byteLength(json, 'utf8') > 200 * 1024) {
                // si grande, almacenar solo un resumen
                return {
                    summary: {
                        message: subset.message,
                        platform: subset.platform,
                        level: subset.level,
                        culprit: subset.culprit
                    }
                };
            }
            return subset;
        } catch (e) {
            return {};
        }
    }

    buildLogPayload(eventData) {
        const { filename, functionName } = this.extractFrameInfo(eventData.raw);
        const errorType = this.mapToSchemaErrorType(eventData.level);
        const env = eventData.tags?.environment || process.env.NODE_ENV || 'development';
        const ip = eventData.user?.ip_address || eventData.user?.ip || null;

        return {
            // Campos del modelo original (mantener compatibilidad)
            sentry_event_id: eventData.eventId || `no-eventid-${Date.now()}`,
            message: eventData.message || 'Error sin mensaje',
            link_sentry: this.buildSentryLink(eventData),
            culprit: eventData.culprit || '',
            filename: filename || '',
            function_name: functionName || '',
            error_type: errorType,
            environment: env,
            affected_user_ip: ip,
            sentry_timestamp: eventData.timestamp || new Date(),
            created_at: new Date(),
            comments: '',
            status: 'unresolved',
            userId: null,
            json_sentry: this.sanitizeRaw(eventData.raw),
            
            // NUEVOS CAMPOS para funcionalidad completa
            source: 'sentry',
            level: eventData.level || 'error',
            category: this.categorizeEvent(eventData),
            severity: this.calculateSeverity(eventData.level),
            metadata: {
                eventId: eventData.eventId,
                culprit: eventData.culprit,
                platform: eventData.platform,
                tags: eventData.tags,
                user: eventData.user,
                request: eventData.request,
                contexts: eventData.contexts
            },
            timestamp: eventData.timestamp || new Date()
        };
    }

    /**
     * Categoriza el evento basado en su contenido
     */
    categorizeEvent(eventData) {
        const message = (eventData.message || '').toLowerCase();
        if (message.includes('database') || message.includes('db') || message.includes('mongodb')) {
            return 'database';
        }
        if (message.includes('auth') || message.includes('login') || message.includes('authorized')) {
            return 'authentication';
        }
        if (message.includes('validation') || message.includes('validate')) {
            return 'validation';
        }
        if (message.includes('permission') || message.includes('access') || message.includes('unauthorized')) {
            return 'authorization';
        }
        
        return 'general';
    }

    /**
     * Calcula la severidad del evento
     */
    calculateSeverity(level) {
        const severityMap = {
            'fatal': 'critical',
            'error': 'high',
            'warning': 'medium',
            'info': 'low',
            'debug': 'low'
        };
        
        return severityMap[level] || 'medium';
    }

    /**
     * Guarda el log en DB (idempotente por sentry_event_id).
     */
    async createLogFromSentry(eventData) {
        try {
            // asegurar que existan campos mínimos
            if (!eventData.timestamp) eventData.timestamp = new Date();
            if (!eventData.eventId) eventData.eventId = `no-eventid-${Date.now()}`;

            const payload = this.buildLogPayload(eventData);

            // idempotencia: findOneAndUpdate con upsert:false (si existe, actualizar campos) o crear
            const existing = await Log.findOne({ sentry_event_id: payload.sentry_event_id });
            if (existing) {
                // actualizar campos que interesen (last seen pattern)
                existing.sentry_timestamp = payload.sentry_timestamp;
                existing.message = existing.message || payload.message;
                existing.culprit = existing.culprit || payload.culprit;
                existing.json_sentry = existing.json_sentry || payload.json_sentry;
                existing.level = payload.level;
                existing.category = payload.category;
                existing.severity = payload.severity;
                existing.metadata = payload.metadata;
                existing.timestamp = payload.timestamp;
                // opcional: incrementar contador (si lo añades al schema)
                await existing.save();
                return existing;
            }

            const log = new Log(payload);
            await log.save();
            return log;
        } catch (err) {
            console.error('Error creando log desde Sentry (mapeado):', err);
            throw err;
        }
    }

    async createTransactionLog(transactionData) {
        try {
            const logData = {
                sentry_event_id: null,
                message: `Transacción: ${transactionData.operation}`,
                link_sentry: '',
                culprit: '',
                filename: '',
                function_name: '',
                error_type: 'info',
                environment: transactionData.tags?.environment || process.env.NODE_ENV || 'development',
                affected_user_ip: null,
                sentry_timestamp: transactionData.timestamp || new Date(),
                created_at: new Date(),
                comments: '',
                status: 'unresolved',
                userId: null,
                json_sentry: this.sanitizeRaw(transactionData.raw),
                
                // NUEVOS CAMPOS
                source: 'sentry-transaction',
                level: 'info',
                category: 'performance',
                severity: 'low',
                metadata: {
                    operation: transactionData.operation,
                    duration: transactionData.duration,
                    status: transactionData.status,
                    tags: transactionData.tags
                },
                timestamp: transactionData.timestamp || new Date()
            };
            const log = new Log(logData);
            await log.save();
            return log;
        } catch (err) {
            console.error('Error creando log de transacción:', err);
            throw err;
        }
    }

    async processMetrics(eventData) {
        try {
            // Ejemplo: contar en 24h
            const level = this.mapToSchemaErrorType(eventData.level);
            const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const count = await Log.countDocuments({ error_type: level, sentry_timestamp: { $gte: since } });
            if (count > 100) {
                console.warn(`⚠️ Muchos errores: ${count} en las últimas 24h (level=${level})`);
                // aquí notificar si quieres
            }
        } catch (err) {
            console.error('Error procesando métricas:', err);
        }
    }

    mapSentryLevelToLogLevel(sentryLevel) {
        // devuelve el mismo que error_type para métricas
        return this.mapToSchemaErrorType(sentryLevel);
    }

    async getSentryStats(timeRange = '24h') {
        try {
            const now = new Date();
            let startDate;
            switch (timeRange) {
                case '1h':
                    startDate = new Date(now.getTime() - 60 * 60 * 1000);
                    break;
                case '7d':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '24h':
                default:
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }

            const stats = await Log.aggregate([
                { $match: { source: { $in: ['sentry', 'sentry-transaction'] }, sentry_timestamp: { $gte: startDate } } },
                {
                    $group: {
                        _id: { error_type: '$error_type', environment: '$environment', category: '$category' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            return stats;
        } catch (err) {
            console.error('Error obteniendo estadísticas de Sentry:', err);
            throw err;
        }
    }
}

module.exports = new SentryService();
