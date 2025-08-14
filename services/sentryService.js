// ============================================
// services/sentryService.js
// Servicio para procesar eventos de Sentry automáticamente
// ============================================
const Sentry = require('../instrument');
const Log = require('../models/log');

class SentryService {
    
    /**
     * Procesa un evento de Sentry automáticamente
     * @param {Object} event - Evento de Sentry
     * @param {Object} hint - Información adicional del evento
     */
    async processSentryEvent(event, hint = {}) {
        try {
            // Extraer información clave del evento
            const eventData = this.extractEventData(event, hint);
            
            // Crear log automáticamente
            await this.createLogFromSentry(eventData);
            
            // Procesar métricas y alertas si es necesario
            await this.processMetrics(eventData);
            
            console.log(`✅ Evento Sentry procesado: ${eventData.message}`);
            
        } catch (error) {
            console.error('❌ Error procesando evento Sentry:', error);
            // No re-lanzar para no romper el flujo
        }
    }
    
    /**
     * Procesa una transacción de Sentry
     * @param {Object} transaction - Transacción de Sentry
     */
    async processSentryTransaction(transaction) {
        try {
            const transactionData = this.extractTransactionData(transaction);
            
            // Crear log de transacción
            await this.createTransactionLog(transactionData);
            
            console.log(`✅ Transacción Sentry procesada: ${transactionData.operation}`);
            
        } catch (error) {
            console.error('❌ Error procesando transacción Sentry:', error);
        }
    }
    
    /**
     * Extrae datos relevantes del evento de Sentry
     */
    extractEventData(event, hint) {
        const eventId = event.event_id || (hint && hint.event_id);
        const message = event.message || 
                       (event.exception && event.exception.values && 
                        event.exception.values[0] && 
                        event.exception.values[0].value) || 
                       'Error sin mensaje';
        
        const level = event.level || 'error';
        const culprit = event.culprit || '';
        const timestamp = event.timestamp ? new Date(event.timestamp * 1000) : new Date();
        
        // Extraer tags útiles
        const tags = this.extractTags(event);
        
        // Extraer contexto del usuario si está disponible
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
            raw: event // Datos completos para debugging
        };
    }
    
    /**
     * Extrae datos de una transacción
     */
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
    
    /**
     * Extrae tags del evento de forma robusta
     */
    extractTags(event) {
        const tags = {};
        
        if (event.tags) {
            if (Array.isArray(event.tags)) {
                // Tags como array de arrays [[key, value]]
                event.tags.forEach(tag => {
                    if (Array.isArray(tag) && tag.length >= 2) {
                        tags[tag[0]] = tag[1];
                    }
                });
            } else if (typeof event.tags === 'object') {
                // Tags como objeto {key: value}
                Object.assign(tags, event.tags);
            }
        }
        
        return tags;
    }
    
    /**
     * Crea un log automáticamente desde el evento de Sentry
     */
    async createLogFromSentry(eventData) {
        try {
            const logData = {
                level: this.mapSentryLevelToLogLevel(eventData.level),
                message: eventData.message,
                source: 'sentry',
                metadata: {
                    eventId: eventData.eventId,
                    culprit: eventData.culprit,
                    platform: eventData.platform,
                    tags: eventData.tags,
                    user: eventData.user,
                    request: eventData.request,
                    contexts: eventData.contexts
                },
                timestamp: eventData.timestamp,
                // Campos adicionales para categorización
                category: this.categorizeEvent(eventData),
                severity: this.calculateSeverity(eventData.level)
            };
            
            const log = new Log(logData);
            await log.save();
            
            return log;
            
        } catch (error) {
            console.error('Error creando log desde Sentry:', error);
            throw error;
        }
    }
    
    /**
     * Crea un log para transacciones
     */
    async createTransactionLog(transactionData) {
        try {
            const logData = {
                level: 'info',
                message: `Transacción: ${transactionData.operation}`,
                source: 'sentry-transaction',
                metadata: {
                    operation: transactionData.operation,
                    duration: transactionData.duration,
                    status: transactionData.status,
                    tags: transactionData.tags
                },
                timestamp: transactionData.timestamp,
                category: 'performance',
                severity: 'low'
            };
            
            const log = new Log(logData);
            await log.save();
            
            return log;
            
        } catch (error) {
            console.error('Error creando log de transacción:', error);
            throw error;
        }
    }
    
    /**
     * Mapea niveles de Sentry a niveles de log
     */
    mapSentryLevelToLogLevel(sentryLevel) {
        const levelMap = {
            'fatal': 'fatal',
            'error': 'error',
            'warning': 'warn',
            'info': 'info',
            'debug': 'debug'
        };
        
        return levelMap[sentryLevel] || 'error';
    }
    
    /**
     * Categoriza el evento basado en su contenido
     */
    categorizeEvent(eventData) {
        if (eventData.message.includes('database') || eventData.message.includes('db')) {
            return 'database';
        }
        if (eventData.message.includes('auth') || eventData.message.includes('login')) {
            return 'authentication';
        }
        if (eventData.message.includes('validation')) {
            return 'validation';
        }
        if (eventData.message.includes('permission') || eventData.message.includes('access')) {
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
     * Procesa métricas del evento
     */
    async processMetrics(eventData) {
        try {
            // Aquí puedes implementar lógica para:
            // - Contar errores por categoría
            // - Alertar si hay muchos errores similares
            // - Actualizar dashboards en tiempo real
            
            // Ejemplo: Contar errores por nivel
            const errorCount = await Log.countDocuments({
                level: this.mapSentryLevelToLogLevel(eventData.level),
                timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Últimas 24h
            });
            
            // Si hay muchos errores, podrías enviar una alerta
            if (errorCount > 100) {
                console.warn(`⚠️ Muchos errores detectados: ${errorCount} en las últimas 24h`);
                // Aquí podrías enviar notificación por email, Slack, etc.
            }
            
        } catch (error) {
            console.error('Error procesando métricas:', error);
        }
    }
    
    /**
     * Obtiene estadísticas de eventos de Sentry
     */
    async getSentryStats(timeRange = '24h') {
        try {
            const now = new Date();
            let startDate;
            
            switch (timeRange) {
                case '1h':
                    startDate = new Date(now.getTime() - 60 * 60 * 1000);
                    break;
                case '24h':
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }
            
            const stats = await Log.aggregate([
                {
                    $match: {
                        source: { $in: ['sentry', 'sentry-transaction'] },
                        timestamp: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            level: '$level',
                            category: '$category',
                            source: '$source'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);
            
            return stats;
            
        } catch (error) {
            console.error('Error obteniendo estadísticas de Sentry:', error);
            throw error;
        }
    }
}

module.exports = new SentryService();