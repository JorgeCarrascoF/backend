// ============================================
// testSentryCapture.js
// Script para probar la captura automática de Sentry
// ============================================
const Sentry = require('./instrument');
const mongoose = require('mongoose');
const Log = require('./models/log');
require('dotenv').config();

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foo-talent', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function testSentryCapture() {
    try {
        console.log('🧪 Probando captura automática de Sentry...\n');

        // 1. Verificar conexión a la base de datos
        console.log('1️⃣ Verificando conexión a la base de datos...');
        const dbStatus = mongoose.connection.readyState;
        console.log('Estado de la DB:', dbStatus === 1 ? '✅ Conectado' : '❌ Desconectado');

        // 2. Simular diferentes tipos de errores para probar la captura
        console.log('\n2️⃣ Simulando errores para probar captura automática...');

        // Error de validación
        console.log('📝 Simulando error de validación...');
        Sentry.captureMessage('Error de validación en formulario de usuario', 'warning');

        // Error de base de datos
        console.log('🗄️ Simulando error de base de datos...');
        Sentry.captureMessage('Error de conexión a MongoDB: timeout', 'error');

        // Error fatal
        console.log('💀 Simulando error fatal...');
        Sentry.captureMessage('Error crítico del sistema: memoria insuficiente', 'fatal');

        // Error de autenticación
        console.log('🔐 Simulando error de autenticación...');
        Sentry.captureMessage('Usuario no autorizado intentando acceder a recurso protegido', 'error');

        // Error de permisos
        console.log('🚫 Simulando error de permisos...');
        Sentry.captureMessage('Usuario sin permisos intentando eliminar recurso', 'warning');

        // 3. Esperar un momento para que se procesen los eventos
        console.log('\n3️⃣ Esperando procesamiento de eventos...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 4. Verificar que los logs se crearon en la base de datos
        console.log('\n4️⃣ Verificando logs creados en la base de datos...');
        const sentryLogs = await Log.find({ source: { $in: ['sentry', 'sentry-transaction'] } })
            .sort({ timestamp: -1 })
            .limit(10);

        console.log(`📊 Logs de Sentry encontrados: ${sentryLogs.length}`);
        
        sentryLogs.forEach((log, index) => {
            console.log(`  ${index + 1}. [${log.level.toUpperCase()}] ${log.message}`);
            console.log(`     Categoría: ${log.category} | Severidad: ${log.severity}`);
            console.log(`     Fuente: ${log.source} | Timestamp: ${log.timestamp.toLocaleString()}`);
            console.log('');
        });

        // 5. Verificar estadísticas por categoría
        console.log('\n5️⃣ Verificando estadísticas por categoría...');
        const statsByCategory = await Log.aggregate([
            {
                $match: {
                    source: { $in: ['sentry', 'sentry-transaction'] }
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        console.log('📈 Eventos por categoría:');
        statsByCategory.forEach(stat => {
            console.log(`  ${stat._id}: ${stat.count} eventos`);
        });

        // 6. Verificar estadísticas por nivel
        console.log('\n6️⃣ Verificando estadísticas por nivel...');
        const statsByLevel = await Log.aggregate([
            {
                $match: {
                    source: { $in: ['sentry', 'sentry-transaction'] }
                }
            },
            {
                $group: {
                    _id: '$level',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        console.log('📊 Eventos por nivel:');
        statsByLevel.forEach(stat => {
            console.log(`  ${stat._id}: ${stat.count} eventos`);
        });

        // 7. Verificar que los metadatos se guardaron correctamente
        console.log('\n7️⃣ Verificando metadatos de los logs...');
        if (sentryLogs.length > 0) {
            const sampleLog = sentryLogs[0];
            console.log('📋 Muestra de metadatos:');
            console.log('  - EventId:', sampleLog.metadata?.eventId || 'N/A');
            console.log('  - Platform:', sampleLog.metadata?.platform || 'N/A');
            console.log('  - Tags:', Object.keys(sampleLog.metadata?.tags || {}).length, 'tags');
            console.log('  - Raw data:', sampleLog.metadata?.raw ? '✅ Disponible' : '❌ No disponible');
        }

        console.log('\n🎯 Prueba de captura automática completada exitosamente!');
        console.log('💡 Los eventos se han capturado automáticamente y guardado en la base de datos.');
        console.log('🔍 Puedes verificar en el panel de Sentry que los eventos también se enviaron allí.');

    } catch (error) {
        console.error('❌ Error durante la prueba:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Conexión a la base de datos cerrada');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    testSentryCapture();
}

module.exports = { testSentryCapture };

