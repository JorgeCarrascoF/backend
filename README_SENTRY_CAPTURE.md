# Captura Automática de Sentry - Foo Talent Backend

## 🚀 Implementación Completada

Se ha implementado exitosamente un sistema de **captura automática** de eventos de Sentry que procesa cada evento localmente antes de enviarlo al panel de Sentry.

## 🔄 Cómo Funciona

### 1. **Captura Automática (Opción A - Rápida)**
- **No bloqueante**: Los eventos se procesan de forma asíncrona
- **Tiempo real**: Cada evento se captura inmediatamente
- **Doble envío**: Se guarda localmente Y se envía a Sentry
- **Sin webhooks**: No necesitas configurar webhooks externos

### 2. **Flujo de Procesamiento**
```
Error/Evento → Sentry.captureException() → beforeSend() → Procesamiento Local → Envío a Sentry
```

### 3. **Ventajas de esta Implementación**
- ✅ **Inmediato**: No hay delay en el procesamiento
- ✅ **Confiable**: Si falla el procesamiento local, Sentry sigue funcionando
- ✅ **Eficiente**: No bloquea las peticiones HTTP
- ✅ **Completo**: Captura tanto eventos como transacciones

## 🛠️ Configuración

### Archivo `instrument.js`
```javascript
Sentry.init({
    // ... configuración básica ...
    
    beforeSend(event, hint) {
        // Procesamiento no bloqueante
        setImmediate(() => {
            require('./services/sentryService').processSentryEvent(event, hint);
        });
        return event; // Continúa el envío a Sentry
    },
    
    beforeSendTransaction(event) {
        // Procesamiento de transacciones
        setImmediate(() => {
            require('./services/sentryService').processSentryTransaction(event);
        });
        return event;
    }
});
```

## 📊 Datos Capturados

### **Eventos de Error**
- `eventId`: ID único del evento
- `message`: Mensaje del error
- `level`: Nivel de severidad (fatal, error, warning, info, debug)
- `culprit`: Función/archivo donde ocurrió el error
- `timestamp`: Cuándo ocurrió
- `platform`: Plataforma (Node.js, etc.)
- `tags`: Tags personalizados
- `user`: Información del usuario (si está disponible)
- `request`: Detalles de la petición HTTP
- `contexts`: Contexto adicional del error

### **Transacciones**
- `operation`: Nombre de la operación
- `duration`: Duración de la transacción
- `status`: Estado de la transacción
- `tags`: Tags de la transacción

## 🗄️ Almacenamiento en Base de Datos

### **Modelo de Log**
```javascript
{
    level: 'error',           // Mapeado desde Sentry
    message: 'Error message', // Mensaje del evento
    source: 'sentry',         // Fuente del log
    category: 'database',     // Categoría automática
    severity: 'high',         // Severidad calculada
    metadata: {
        eventId: 'abc123',
        culprit: 'functionName',
        platform: 'node',
        tags: { environment: 'production' },
        user: { id: '123', email: 'user@example.com' },
        request: { method: 'POST', url: '/api/users' },
        raw: { /* datos completos de Sentry */ }
    },
    timestamp: new Date()
}
```

## 🔍 Categorización Automática

### **Categorías Detectadas**
- **`database`**: Errores relacionados con base de datos
- **`authentication`**: Errores de autenticación
- **`validation`**: Errores de validación
- **`authorization`**: Errores de permisos
- **`general`**: Otros tipos de errores
- **`performance`**: Transacciones y métricas de rendimiento

### **Severidad Calculada**
- **`critical`**: Errores fatales
- **`high`**: Errores críticos
- **`medium`**: Advertencias
- **`low`**: Información y debug

## 📋 Endpoints de Consulta

### **Estadísticas**
```bash
GET /api/sentry/stats?timeRange=24h
GET /api/sentry/summary
```

### **Eventos por Categoría**
```bash
GET /api/sentry/events/category?category=database&limit=50&page=1
```

### **Eventos por Nivel**
```bash
GET /api/sentry/events/level?level=error&limit=50&page=1
```

### **Evento Específico**
```bash
GET /api/sentry/events/:id
```

## 🧪 Pruebas

### **Script de Prueba Automatizado**
```bash
npm run test-sentry
```

Este script:
1. Simula diferentes tipos de errores
2. Verifica que se capturen automáticamente
3. Comprueba que se guarden en la base de datos
4. Muestra estadísticas y metadatos

### **Prueba Manual**
```javascript
const Sentry = require('./instrument');

// Capturar mensaje
Sentry.captureMessage('Error de prueba', 'error');

// Capturar excepción
try {
    throw new Error('Error de prueba');
} catch (error) {
    Sentry.captureException(error);
}
```

## 🔒 Seguridad y Permisos

### **Acceso a Endpoints**
- **Admin y Superadmin**: Acceso completo a todas las estadísticas
- **Usuarios normales**: No pueden acceder a datos de Sentry

### **Validación de Datos**
- Todos los datos se validan antes de guardar
- Sanitización de metadatos sensibles
- Prevención de inyección de datos maliciosos

## 📈 Métricas y Alertas

### **Métricas Automáticas**
- Conteo de errores por categoría
- Conteo de errores por nivel
- Tendencias temporales (últimas 24h, 7 días, etc.)
- Alertas automáticas para umbrales altos

### **Alertas Configurables**
```javascript
// Ejemplo: Alerta si hay más de 100 errores en 24h
if (errorCount > 100) {
    console.warn(`⚠️ Muchos errores detectados: ${errorCount} en las últimas 24h`);
    // Aquí podrías enviar notificación por email, Slack, etc.
}
```

## 🚨 Monitoreo en Tiempo Real

### **Logs en Consola**
- ✅ Eventos procesados exitosamente
- ❌ Errores en el procesamiento
- ⚠️ Alertas y advertencias

### **Base de Datos**
- Todos los eventos se almacenan inmediatamente
- Búsqueda y filtrado en tiempo real
- Historial completo de errores

## 🔧 Personalización

### **Agregar Nuevas Categorías**
```javascript
categorizeEvent(eventData) {
    if (eventData.message.includes('payment')) {
        return 'payment';
    }
    // ... resto de categorías
    return 'general';
}
```

### **Agregar Nuevas Métricas**
```javascript
async processMetrics(eventData) {
    // Tu lógica personalizada aquí
    if (eventData.level === 'fatal') {
        await this.sendEmergencyAlert(eventData);
    }
}
```

## 📞 Soporte y Troubleshooting

### **Problemas Comunes**
1. **Eventos no se capturan**: Verificar conexión a la base de datos
2. **Errores en procesamiento**: Revisar logs de consola
3. **Datos incompletos**: Verificar configuración de Sentry

### **Logs de Debug**
```javascript
// Habilitar debug en desarrollo
debug: process.env.NODE_ENV === 'development'
```

### **Verificación de Estado**
```bash
# Verificar logs de Sentry
npm run test-sentry

# Verificar estado del sistema
npm run test-superadmin
```

## 🎯 Próximos Pasos

1. **Ejecutar** `npm run test-sentry` para probar la captura
2. **Verificar** que los eventos aparezcan en el panel de Sentry
3. **Consultar** estadísticas usando los endpoints de la API
4. **Personalizar** categorías y métricas según tus necesidades

## 💡 Casos de Uso

- **Monitoreo en tiempo real** de errores de producción
- **Análisis de tendencias** de errores por categoría
- **Alertas automáticas** para errores críticos
- **Auditoría completa** de todos los eventos del sistema
- **Integración** con sistemas de monitoreo externos
