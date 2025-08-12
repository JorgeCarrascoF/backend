const eventService = require('../services/eventService');

const rolAdmin = 'admin';

const getAllEvents = async (req, res) => {
    try {
        console.log('🔍 DEBUG getAllEvents:');
        console.log('- Usuario en req:', req.user);
        console.log('- Rol del usuario:', req.user?.role);
        const roles = ['admin', 'user'];
         if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                msg: 'Acceso denegado. Se requiere rol de administrador, desarrollador o QA.',
                userRole: req.user.role,
                required: roles
            });
        }

        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        //const totalEvents = await Event.countDocuments(searchQuery);
        const events = await eventService.getAllEvents(req.query, { limit, skip });

        res.status(200).json({
            success: true,
            page,
            limit,
            count: events.length,
            data: events
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener los eventos', error: err.message });
    }
};

const getEventById = async (req, res) => {
    try {
        console.log('🔍 DEBUG getEventById:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID solicitado:', req.params.id);

        const roles = ['admin', 'user'];
        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado.',
                detail: 'Solo los adminstradores, desarrolladores y QA pueden ver los eventos por ID'
            });
        }

        const event = await eventService.getEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Evento no encontrado.' });
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al obtener el Evento', error: err.message });
    }
};

const createEvent = async (req, res) => {
    try {
        if (!rolAdmin.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Acceso denegado para crear eventos.' });
        }

        const newEvent = await eventService.createEvent(req.body);

        res.status(201).json({ msg: 'Evento creado exitosamente', event: newEvent });
    } catch (err) {
        res.status(500).json({ msg: 'Error al crear el Evento', error: err.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        console.log('🔍 DEBUG updateEvent:');
        console.log('- Event solicitante:', req.Event);
        console.log('- ID a actualizar:', req.params.id);
        console.log('- Datos a actualizar:', req.body);

        if (!rolAdmin.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para actualizar este log.' });
        }

        const event = await eventService.updateEvent(req.params.id, req.body);

        if (!event) {
            return res.status(404).json({ msg: 'Evento no encontrado.' });
        }

        res.status(200).json({ msg: 'Evento actualizado exitosamente.', event });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al actualizar el Evento', error: err.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        console.log('🔍 DEBUG deleteEvent:');
        console.log('- Log solicitante:', req.Event);
        console.log('- ID a eliminar:', req.params.id);

        if (!rolAdmin.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ msg: 'Acceso denegado para eliminar este Evento.' });
        }

        const event = await eventService.deleteEvent(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Evento no encontrado.' });
        }

        res.status(200).json({ msg: 'Evento eliminado exitosamente.', deletedEvent: { id: event._id } });
    } catch (err) {
        res.status(500).json({ msg: 'Error del servidor al eliminar el Evento', error: err.message });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
