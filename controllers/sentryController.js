// ============================================
// controllers/sentryController.js
// Controlador para manejar estadísticas y consultas de Sentry
// ============================================
const sentryService = require('../services/sentryService');
const Sentry = require('../instrument');

/**
 * Obtiene estadísticas de eventos de Sentry
 */
const getSentryStats = async (req, res) => {
    try {
        const { timeRange = '24h' } = req.query;
        
        // Validar timeRange
        const validTimeRanges = ['1h', '24h', '7d', '30d'];
        if (!validTimeRanges.includes(timeRange)) {
            return res.status(400).json({
                success: false,
                message: 'TimeRange inválido. Valores permitidos: 1h, 24h, 7d, 30d'
            });
        }

        const stats = await sentryService.getSentryStats(timeRange);
        
        res.status(200).json({
            success: true,
            timeRange,
            data: stats,
            timestamp: new Date()
        });

    } catch (error) {
        Sentry.captureException(error);
        console.error('Error obteniendo estadísticas de Sentry:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo estadísticas de Sentry',
            error: error.message
        });
    }
};

/**
 * Obtiene eventos de Sentry por categoría
 */
const getSentryEventsByCategory = async (req, res) => {
    try {
        const { category, limit = 50, page = 1 } = req.query;
        
        // Validar categoría
        const validCategories = ['database', 'authentication', 'validation', 'authorization', 'general', 'performance'];
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Categoría inválida',
                validCategories
            });
        }

        const Log = require('../models/log');
        const query = { source: { $in: ['sentry', 'sentry-transaction'] } };
        
        if (category) {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const events = await Log.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await Log.countDocuments(query);

        res.status(200).json({
            success: true,
            category: category || 'all',
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            },
            data: events
        });

    } catch (error) {
        Sentry.captureException(error);
        console.error('Error obteniendo eventos de Sentry por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo eventos de Sentry',
            error: error.message
        });
    }
};

/**
 * Obtiene eventos de Sentry por nivel de severidad
 */
const getSentryEventsByLevel = async (req, res) => {
    try {
        const { level, limit = 50, page = 1 } = req.query;
        
        // Validar nivel
        const validLevels = ['fatal', 'error', 'warn', 'info', 'debug'];
        if (level && !validLevels.includes(level)) {
            return res.status(400).json({
                success: false,
                message: 'Nivel inválido',
                validLevels
            });
        }

        const Log = require('../models/log');
        const query = { source: { $in: ['sentry', 'sentry-transaction'] } };
        
        if (level) {
            query.level = level;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const events = await Log.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        const total = await Log.countDocuments(query);

        res.status(200).json({
            success: true,
            level: level || 'all',
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            },
            data: events
        });

    } catch (error) {
        Sentry.captureException(error);
        console.error('Error obteniendo eventos de Sentry por nivel:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo eventos de Sentry',
            error: error.message
        });
    }
};

/**
 * Obtiene resumen de eventos de Sentry
 */
const getSentrySummary = async (req, res) => {
    try {
        const Log = require('../models/log');
        
        // Estadísticas generales
        const totalEvents = await Log.countDocuments({ 
            source: { $in: ['sentry', 'sentry-transaction'] } 
        });
        
        const totalErrors = await Log.countDocuments({ 
            source: { $in: ['sentry', 'sentry-transaction'] },
            level: { $in: ['error', 'fatal'] }
        });
        
        const totalWarnings = await Log.countDocuments({ 
            source: { $in: ['sentry', 'sentry-transaction'] },
            level: 'warn'
        });

        // Eventos de las últimas 24h
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const eventsLast24h = await Log.countDocuments({
            source: { $in: ['sentry', 'sentry-transaction'] },
            timestamp: { $gte: last24h }
        });

        const errorsLast24h = await Log.countDocuments({
            source: { $in: ['sentry', 'sentry-transaction'] },
            level: { $in: ['error', 'fatal'] },
            timestamp: { $gte: last24h }
        });

        // Eventos por categoría
        const eventsByCategory = await Log.aggregate([
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

        // Eventos por nivel
        const eventsByLevel = await Log.aggregate([
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

        res.status(200).json({
            success: true,
            summary: {
                total: {
                    events: totalEvents,
                    errors: totalErrors,
                    warnings: totalWarnings
                },
                last24h: {
                    events: eventsLast24h,
                    errors: errorsLast24h
                },
                byCategory: eventsByCategory,
                byLevel: eventsByLevel
            },
            timestamp: new Date()
        });

    } catch (error) {
        Sentry.captureException(error);
        console.error('Error obteniendo resumen de Sentry:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo resumen de Sentry',
            error: error.message
        });
    }
};

/**
 * Obtiene un evento específico de Sentry por ID
 */
const getSentryEventById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const Log = require('../models/log');
        const event = await Log.findOne({
            _id: id,
            source: { $in: ['sentry', 'sentry-transaction'] }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Evento de Sentry no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });

    } catch (error) {
        Sentry.captureException(error);
        console.error('Error obteniendo evento de Sentry por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo evento de Sentry',
            error: error.message
        });
    }
};

module.exports = {
    getSentryStats,
    getSentryEventsByCategory,
    getSentryEventsByLevel,
    getSentrySummary,
    getSentryEventById
};
