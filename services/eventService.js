/*const Event = require('../models/event');

const getAllEvents = async (filters, pagination) => {
    const { limit, skip } = pagination;
    const query = {};

    if (filters.search) {
        query.$or = [
            { issue_id: { $regex: filters.search, $options: 'i' } },
            { short_id: { $regex: filters.search, $options: 'i' } },
            { title: { $regex: filters.search, $options: 'i' } },
            { level: { $regex: filters.search, $options: 'i' } },
            { project_id: { $regex: filters.search, $options: 'i' } },
            { status: { $regex: filters.search, $options: 'i' } },      
        ];
    }

    ['issue_id', 'short_id', 'title', 'level', 'project_id', 'status']
        .forEach(field => {
            if (filters[field]) query[field] = filters[field];
        });

    const events = await Event.find(query)
        //.populate('userId', 'username email')
        .skip(skip)
        .limit(limit)
        .sort({ lastSeen: -1 });

    return events.map(event => ({
        id: event._id,
        issue_id: event.issue_id,
        short_id: event.short_id,
        title: event.title,
        level: event.level,
        project_id: event.project_id,
        status: event.status,
        count: event.count,
        user_count: event.user_count,
        is_unhandled: event.is_unhandled,
        created_at: event.created_at,
        update_at: event.update_at,
    }));
};

const getEventById = async (id) => {
    const event = await Event.findById(id)
        //.populate('userId', 'username email')
        .select('-password');

    if (!event) return null;

    return {
        id: event._id,
        issue_id: event.issue_id,
        short_id: event.short_id,
        title: event.title,
        level: event.level,
        project_id: event.project_id,
        status: event.status,
        count: event.count,
        user_count: event.user_count,
        is_unhandled: event.is_unhandled,
        created_at: event.created_at,
        update_at: event.update_at,
    };
};

const createEvent = async (data) => {
    const newEvent = new Event(data);
    return await newEvent.save();
};

const updateEvent = async (id, data) => {
    const event = await Event.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })//.populate('userId', 'username email').select('-password');

    if (!event) return null;

    return {
        id: event._id,
        issue_id: event.issue_id,
        short_id: event.short_id,
        title: event.title,
        level: event.level,
        project_id: event.project_id,
        status: event.status,
        count: event.count,
        user_count: event.user_count,
        is_unhandled: event.is_unhandled,
        created_at: event.created_at,
        update_at: event.update_at,
    };
};

const deleteEvent = async (id) => {
    return await Event.findByIdAndDelete(id);
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
*/