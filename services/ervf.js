const getAllLogs = async (filters, pagination) => {
    const { limit, skip } = pagination; const query = {};
    
    if (filters.search) {
        query.$or =
            [{ _id: { $regex: filters.search, $options: 'i' } },
            { issue_id: { $regex: filters.search, $options: 'i' } },
            { message: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
            { culprit: { $regex: filters.search, $options: 'i' } },
            { error_type: { $regex: filters.search, $options: 'i' } },
            { environment: { $regex: filters.search, $options: 'i' } },
            { status: { $regex: filters.search, $options: 'i' } },
            { priority: { $regex: filters.search, $options: 'i' } },
            { assigned_to: { $regex: filters.search, $options: 'i' } }];
    }
    ['_id', 'issue_id', 'message', 'description', 'culprit', 'error_type', 'environment',
        'status', 'priority', 'assigned_to', 'active']
        .forEach(field => { if (filters[field]) query[field] = filters[field]; });
    const logs = await Log.find(query)
        .populate('userId', 'username email')
        .skip(skip).limit(limit)
        .sort({ created_at: -1 });
    const totalLogs = await Log.countDocuments(query);
    return {
        data: logs.map(
            log => ({
                id: log._id,
                issue_id: log.issue_id,
                message: log.message,
                description: log.description,
                culprit: log.culprit,
                error_type: log.error_type,
                environment: log.environment,
                status: log.status,
                priority: log.priority,
                assigned_to: log.assigned_to,
                created_at: log.created_at,
                last_seen_at: log.last_seen_at,
                count: log.count,
                active: log.active,
            })),
        total: totalLogs
    };
};