/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - message
 *         - sentry_timestamp
 *         - created_at
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del log
 *         sentry_event_id:
 *           type: string
 *           description: ID del evento en Sentry
 *         event_id:
 *           type: string
 *           description: ID del evento interno
 *         message:
 *           type: string
 *           description: Mensaje del error o log
 *         link_sentry:
 *           type: string
 *           description: Enlace al error en Sentry
 *         culprit:
 *           type: string
 *           description: Causa principal del error
 *         filename:
 *           type: string
 *           description: Nombre del archivo donde ocurrió el error
 *         function_name:
 *           type: string
 *           description: Función donde ocurrió el error
 *         error_type:
 *           type: string
 *           enum: ['error', 'warning', 'info']
 *           description: Tipo de error
 *         environment:
 *           type: string
 *           enum: ['staging', 'development', 'production']
 *           description: Entorno de ejecución
 *         affected_user_ip:
 *           type: string
 *           description: IP del usuario afectado
 *         sentry_timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora original del evento en Sentry
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se registró el log en el sistema
 *         comments:
 *           type: string
 *           description: Comentarios de los usuarios
 *         status:
 *           type: string
 *           enum: ['unresolved', 'solved']
 *           description: Estado del log
 *         userId:
 *           type: string
 *           description: ID del usuario que generó el log
 *         // NUEVOS CAMPOS
 *         source:
 *           type: string
 *           enum: ['sentry', 'sentry-transaction', 'manual', 'system']
 *           description: Fuente del log
 *         level:
 *           type: string
 *           enum: ['fatal', 'error', 'warning', 'info', 'debug']
 *           description: Nivel del log
 *         category:
 *           type: string
 *           enum: ['database', 'authentication', 'validation', 'authorization', 'performance', 'general']
 *           description: Categoría del log
 *         severity:
 *           type: string
 *           enum: ['critical', 'high', 'medium', 'low']
 *           description: Severidad del log
 *         metadata:
 *           type: object
 *           description: Metadatos adicionales del evento
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp del evento
 */