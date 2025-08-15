// ============================================
// scripts/migrateLogs.js
// Script para migrar logs existentes a la nueva estructura
// ============================================
const mongoose = require('mongoose');
const Log = require('../models/log');
require('dotenv').config();

async function migrateLogs() {
    try {
        console.log('🔄 Iniciando migración de logs existentes...\n');

        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foo-talent', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Conectado a la base de datos');

        // Contar logs existentes
        const totalLogs = await Log.countDocuments();
        console.log(`📊 Total de logs encontrados: ${totalLogs}`);

        if (totalLogs === 0) {
            console.log('ℹ️ No hay logs para migrar');
            return;
        }

        // Migrar logs que no tengan los nuevos campos
        const logsToMigrate = await Log.find({
            $or: [
                { source: { $exists: false } },
                { level: { $exists: false } },
                { category: { $exists: false } },
                { severity: { $exists: false } },
                { metadata: { $exists: false } },
                { timestamp: { $exists: false } }
            ]
        });

        console.log(`🔄 Logs que necesitan migración: ${logsToMigrate.length}`);

        if (logsToMigrate.length === 0) {
            console.log('✅ Todos los logs ya están migrados');
            return;
        }

        let migratedCount = 0;
        let errorCount = 0;

        for (const log of logsToMigrate) {
            try {
                // Establecer valores por defecto para campos faltantes
                const updates = {};

                // source: determinar basado en campos existentes
                if (!log.source) {
                    if (log.sentry_event_id) {
                        updates.source = 'sentry';
                    } else {
                        updates.source = 'manual';
                    }
                }

                // level: mapear desde error_type
                if (!log.level && log.error_type) {
                    updates.level = log.error_type;
                } else if (!log.level) {
                    updates.level = 'error';
                }

                // category: determinar basado en el mensaje
                if (!log.category) {
                    const message = (log.message || '').toLowerCase();
                    if (message.includes('database') || message.includes('db') || message.includes('mongodb')) {
                        updates.category = 'database';
                    } else if (message.includes('auth') || message.includes('login')) {
                        updates.category = 'authentication';
                    } else if (message.includes('validation')) {
                        updates.category = 'validation';
                    } else if (message.includes('permission') || message.includes('access')) {
                        updates.category = 'authorization';
                    } else {
                        updates.category = 'general';
                    }
                }

                // severity: calcular basado en level
                if (!log.severity) {
                    const severityMap = {
                        'fatal': 'critical',
                        'error': 'high',
                        'warning': 'medium',
                        'info': 'low',
                        'debug': 'low'
                    };
                    updates.severity = severityMap[updates.level || log.level] || 'medium';
                }

                // metadata: crear estructura básica
                if (!log.metadata) {
                    updates.metadata = {
                        eventId: log.sentry_event_id || null,
                        culprit: log.culprit || '',
                        filename: log.filename || '',
                        functionName: log.function_name || ''
                    };
                }

                // timestamp: usar sentry_timestamp como fallback
                if (!log.timestamp && log.sentry_timestamp) {
                    updates.timestamp = log.sentry_timestamp;
                } else if (!log.timestamp) {
                    updates.timestamp = log.created_at || new Date();
                }

                // Aplicar actualizaciones
                if (Object.keys(updates).length > 0) {
                    await Log.updateOne(
                        { _id: log._id },
                        { $set: updates }
                    );
                    migratedCount++;
                    console.log(`✅ Log ${log._id} migrado`);
                }

            } catch (error) {
                console.error(`❌ Error migrando log ${log._id}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n📊 Resumen de migración:');
        console.log(`✅ Logs migrados exitosamente: ${migratedCount}`);
        console.log(`❌ Errores durante migración: ${errorCount}`);
        console.log(`📈 Total procesado: ${migratedCount + errorCount}`);

        // Verificar logs migrados
        const remainingLogs = await Log.find({
            $or: [
                { source: { $exists: false } },
                { level: { $exists: false } },
                { category: { $exists: false } },
                { severity: { $exists: false } },
                { metadata: { $exists: false } },
                { timestamp: { $exists: false } }
            ]
        });

        if (remainingLogs.length === 0) {
            console.log('\n🎉 ¡Migración completada exitosamente!');
        } else {
            console.log(`\n⚠️ Aún quedan ${remainingLogs.length} logs por migrar`);
        }

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexión a la base de datos cerrada');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    migrateLogs();
}

module.exports = { migrateLogs };
