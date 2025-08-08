const Log = require('../models/log');

const getAllLogs = async (filters, pagination) => {
    const { limit, skip } = pagination;
    const query = {};

    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { linkSentry: { $regex: filters.search, $options: 'i' } },
            { project: { $regex: filters.search, $options: 'i' } },
            { type: { $regex: filters.search, $options: 'i' } },
            { status: { $regex: filters.search, $options: 'i' } },
            { platform: { $regex: filters.search, $options: 'i' } },
            { filename: { $regex: filters.search, $options: 'i' } },
            { function: { $regex: filters.search, $options: 'i' } },
            { priority: { $regex: filters.search, $options: 'i' } },
        ];
    }

    ['title', 'linkSentry', 'project', 'type', 'status', 'platform', 'filename', 'functions', 'priority']
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
        title: log.title,
        linkSentry: log.linkSentry,
        project: log.project,
        type: log.type,
        status: log.status,
        platform: log.platform,
        filename: log.filename,
        function: log.function,
        priority: log.priority,
        count: log.count,
        firstSeen: log.firstSeen,
        lastSeen: log.lastSeen
    }));
};

const getLogById = async (id) => {
    const log = await Log.findById(id)
        .populate('userId', 'username email')
        .select('-password');

    if (!log) return null;

    return {
        id: log._id,
        linkSentry: log.linkSentry,
        project: log.project,
        type: log.type,
        status: log.status,
        platform: log.status,
        filename: log.filename,
        function: log.function,
        priority: log.priority,
        count: log.count,
        firstSeen: log.firstSeen,
        lastSeen: log.lastSeen
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
        linkSentry: log.linkSentry,
        project: log.project,
        type: log.type,
        status: log.status,
        platform: log.status,
        filename: log.filename,
        function: log.function,
        priority: log.priority,
        count: log.count,
        firstSeen: log.firstSeen,
        lastSeen: log.lastSeen
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
