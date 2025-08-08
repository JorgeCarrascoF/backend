const Log = require('../models/log');

const getAllLogs = async (filters, pagination) => {
    const { limit, skip } = pagination;
    const query = {};

    if (filters.search) {
        query.$or = [
            { sentry_event_id: { $regex: filters.search, $options: 'i' } },
            { event_id: { $regex: filters.search, $options: 'i' } },
            { message: { $regex: filters.search, $options: 'i' } },
            { link_sentry: { $regex: filters.search, $options: 'i' } },
            { culprit: { $regex: filters.search, $options: 'i' } },
            { filename: { $regex: filters.search, $options: 'i' } },
            { function_name: { $regex: filters.search, $options: 'i' } },
            { error_type: { $regex: filters.search, $options: 'i' } },
            { environment: { $regex: filters.search, $options: 'i' } },
            { affected_user_ip: { $regex: filters.search, $options: 'i' } },
            { sentry_timestamp: { $regex: filters.search, $options: 'i' } },
            { created_at: { $regex: filters.search, $options: 'i' } },
        ];
    }

    ['sentry_event_id', 'event_id', 'message', 'link_sentry', 'culprit', 'filename', 'function_name', 
        'error_type', 'environment', 'affected_user_ip', 'sentry_timestamp', 'created_at']
        .forEach(field => {
            if (filters[field]) query[field === 'functions' ? 'function' : field] = filters[field];
        });

    const logs = await Log.find(query)
        .populate('userId', 'username email')
        .skip(skip)
        .limit(limit)
        .sort({ lastSeen: -1 });

    return logs.map(log => ({
        id: log._id,
        sentry_event_id: log.sentry_event_id,
        event_id: log.event_id,
        message: log.message,
        link_sentry: log.link_sentry,
        culprit: log.culprit,
        filename: log.filename,
        function_name: log.function_name,
        error_type: log.error_type,
        environment: log.environment,
        affected_user_ip: log.affected_user_ip,
        sentry_timestamp: log.sentry_timestamp,
        created_at: log.created_at
    }));
};

const getLogById = async (id) => {
    const log = await Log.findById(id)
        .populate('userId', 'username email')
        .select('-password');

    if (!log) return null;

    return {
        id: log._id,
        sentry_event_id: log.sentry_event_id,
        event_id: log.event_id,
        message: log.message,
        link_sentry: log.link_sentry,
        culprit: log.culprit,
        filename: log.filename,
        function_name: log.function_name,
        error_type: log.error_type,
        environment: log.environment,
        affected_user_ip: log.affected_user_ip,
        sentry_timestamp: log.sentry_timestamp,
        created_at: log.created_at
    };
};

const createLog = async (data) => {
    const newLog = new Log(data);
    return await newLog.save();
};

const updateLog = async (id, data) => {
    const log = await Log.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate('userId', 'username email').select('-password');

    if (!log) return null;

    return {
        id: log._id,
        sentry_event_id: log.sentry_event_id,
        event_id: log.event_id,
        message: log.message,
        link_sentry: log.link_sentry,
        culprit: log.culprit,
        filename: log.filename,
        function_name: log.function_name,
        error_type: log.error_type,
        environment: log.environment,
        affected_user_ip: log.affected_user_ip,
        sentry_timestamp: log.sentry_timestamp,
        created_at: log.created_at
    };
};

const deleteLog = async (id) => {
    return await Log.findByIdAndDelete(id);
};

module.exports = {
    getAllLogs,
    getLogById,
    createLog,
    updateLog,
    deleteLog
};
