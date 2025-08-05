const Log = require('../models/log');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT obtenido del endpoint de login
 *   schemas:
 *     Log:
 *       type: object
 *     Error:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: string
 *           description: Detalle del error
 */


/**
 * @swagger
 * /logs:
 *   get:
 *     summary: "Obtener todos los Logs u Obtener logs filtrados por paginación"
 *     description: Retorna todos los Logs y permite paginación y búsqueda por filtros. Solo accesible para administradores, desarrolladores y QA's. 
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"

 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página a solicitar (paginación)

 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página

 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda general por: title, project, type, status, priority, etc.

 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Buscar por título exacto del log

 *       - in: query
 *         name: linkSentry
 *         schema:
 *           type: string
 *         description: Buscar por enlace de Sentry exacto

 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *         description: Buscar por nombre de proyecto exacto

 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [error, warning, info]
 *         description: Filtrar por tipo de log

 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [solved, unresolved]
 *         description: Filtrar por estado del log

 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: Filtrar por plataforma

 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del archivo

 *       - in: query
 *         name: functions
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de función

 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [high, medium, low]
 *         description: Filtrar por prioridad

 *     responses:
 *       200:
 *         description: Lista de Logs obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Token no proporcionado"
 *       403:
 *         description: Acceso denegado - Se requiere rol permitido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Acceso denegado. Se requiere rol de administrador, desarrollador o QA."
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAllLogs = async (req, res) => {
    try {
        console.log('🔍 DEBUG getAllLogs:');
        console.log('- Usuario en req:', req.user);
        console.log('- Rol del usuario:', req.user?.role);
        
        const roles = ['admin', 'dev', 'qa'];
         if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                msg: 'Acceso denegado. Se requiere rol de administrador, desarrollador o QA.',
                userRole: req.user.role,
                required: roles
            });
        }

        const limit =  parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const skip = (page-1)*limit;

        const { title, linkSentry, project, type, status, 
            platform, filename, priority, functions } = req.query;

        const query= {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { linkSentry: { $regex: search, $options: 'i' } },
                { project: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { platform: { $regex: search, $options: 'i' } },
                { filename: { $regex: search, $options: 'i' } },
                { function: { $regex: search, $options: 'i' } },
                { priority: { $regex: search, $options: 'i' } },           
            ];
        }

        if (title) query.title = title;
        if (linkSentry) query.linkSentry = linkSentry;
        if (project) query.project = project;
        if (type) query.type = type;
        if (status) query.status = status;
        if (platform) query.platform = platform;
        if (filename) query.filename = filename;
        if (functions) query.function = functions;
        if (priority) query.priority = priority;
        
        //const totalLogs = await Log.countDocuments(searchQuery);

        const logs = await Log.find(query)
            .populate('userId', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ lastSeen: -1 });
            
        // Formatear la respuesta para mostrar información completa
        const formattedLogs = logs.map(log => ({
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
            lastSeen: log.lastSeen,
            //user: log.userId,
        }));

        res.status(200).json({
            success: true,
            page,
            limit,
            //totalPages: Math.ceil(totalLogs/limit),
            //totalResults:totalLogs,
            count: formattedLogs.length,
            data: formattedLogs
        });
    } catch (err) {
        console.error('Error en getAllLogs:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al obtener Logs', 
            error: err.message 
        });
    }
};


/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: "Obtener un Log por ID"
 *     description: Obtiene un Log específico. Solo accesible para administradores, desarrolladores y QA's.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del Log
 *         example: "688abe5d6ad4e846fbdb018c"
 *     responses:
 *       200:
 *         description: Datos del Log obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Acceso denegado."
 *       404:
 *         description: Log no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               msg: "Log no encontrado."
 *       500:
 *         description: Error del servidor
 */
const getLogById = async (req, res) => {
    try {
        console.log('🔍 DEBUG getLogById:');
        console.log('- Usuario solicitante:', req.user);
        console.log('- ID solicitado:', req.params.id);
        
        const roles = ['admin', 'dev', 'qa'];
        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado.',
                detail: 'Solo los adminstradores, desarrolladores y QA pueden ver los logs por ID'
            });
        }

        const log = await Log.findById(req.params.id)
            .populate('userId', 'username email')
            .select('-password');
            
        if (!log) {
            return res.status(404).json({ msg: 'Log no encontrado.' });
        }

        // Formatear respuesta
        const formattedLogs = {
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

        res.status(200).json(formattedLogs);
    } catch (err) {
        console.error('Error en getLogById:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al obtener el Log', 
            error: err.message 
        });
    }
};


/**
 * @swagger
 * /logs/{id}:
 *   patch:
 *     summary: "Actualizar un Log"
 *     description: Actualiza un Log. Solo accesible para administradores, desarrolladores y QA's.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del Log a actualizar
 *         example: "688abe5d6ad4e846fbdb018c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             //$ref: '#/components/schemas/logUpdate'
 *             $ref: '#/components/schemas/Log'
 *     responses:
 *       200:
 *         description: Log actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Log actualizado."
 *                 Log:
 *                   $ref: '#/components/schemas/Log'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Log no encontrado
 *       500:
 *         description: Error del servidor
 */
const updateLog = async (req, res) => {
    try {
        console.log('🔍 DEBUG updateLog:');
        console.log('- Log solicitante:', req.Log);
        console.log('- ID a actualizar:', req.params.id);
        console.log('- Datos a actualizar:', req.body);
        
        const roles = ['admin', 'dev', 'qa'];
        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado para actualizar este log.',
                detail: 'Solo los administradores, desarrolladores y QA pueden actualizar los logs'
            });
        }

        // Un usuario no-admin no puede cambiar el log
        if (!roles.includes(req.user.role)) {
            delete req.body.log;
            delete req.body.logId;
        }

        const log = await Log.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {
                new: true,
                runValidators: true,
            }
        ).populate('userId', 'username email').select('-password');

        if (!log) {
            return res.status(404).json({ msg: 'Log no encontrado.' });
        }

        // Formatear respuesta
        const formattedLogs = {
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

        res.status(200).json({ 
            msg: 'Log actualizado exitosamente.', 
            log: formattedLogs 
        });
    } catch (err) {
        console.error('Error en updateLog:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al actualizar el Log', 
            error: err.message 
        });
    }
};

/**
 * @swagger
 * /logs/{id}:
 *   delete:
 *     summary: "Eliminar un Log"
 *     description: Elimina un Log. Solo accesible para administradores, desarrolladores y QA's.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token JWT en formato "Bearer {token}"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del Log a eliminar
 *         example: "688abe5d6ad4e846fbdb018c"
 *     responses:
 *       200:
 *         description: Log eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Log eliminado exitosamente."
 *                 deletedLog:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     Logname:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Log no encontrado
 *       500:
 *         description: Error del servidor
 */
const deleteLog = async (req, res) => {
    try {
        console.log('🔍 DEBUG deleteLog:');
        console.log('- Log solicitante:', req.Log);
        console.log('- ID a eliminar:', req.params.id);
        
        const roles = ['admin', 'dev', 'qa'];
        if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                msg: 'Acceso denegado para eliminar este usuario.',
                detail: 'Solo los administradores, desarrolladores y QA pueden eliminar otros usuarios'
            });
        }

        const log = await Log.findByIdAndDelete(req.params.id);
        
        if (!log) {
            return res.status(404).json({ msg: 'Log no encontrado.' });
        }

        res.status(200).json({ 
            msg: 'Log eliminado exitosamente.',
            data: log,
            deletedLog: {
                id: log._id,
            }
        });
    } catch (err) {
        console.error('Error al eliminar el log:', err);
        res.status(500).json({ 
            msg: 'Error del servidor al eliminar el Log', 
            error: err.message 
        });
    }
};

/**
 * @swagger
 * /logs:
 *   post:
 *     summary: "Crear nuevo log"
 *     description: Crea un Log. Solo accesible para administradores, desarrolladores y QA's.
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/Log'
 *             type: object
 *             required:
 *               - name
 *               - permission
 *             properties:
 *               name:
 *                 type: string
 *               permission:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Log creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

const createLog = async (req, res) => {
    try {
        /*const existingLog = await Role.findOne({ name });
        if (existingLog) {
            return res.status(400).json({ msg: 'El log ya existe' });
        }*/
       const roles = ['admin', 'dev', 'qa'];
       if (!roles.includes(req.user.role) && req.user.id !== req.params.id) {
        return res.status(403).json({ 
            msg: 'Acceso denegado para crear este log.',
            detail: 'Solo los administradores, desarrolladores y QA pueden crear los logs'
            });
        }

        const {
            title,
            linkSentry,
            project,
            type,
            status,
            platform,
            filename,
            function: functionName,
            priority,
            count,
            firstSeen,
            lastSeen
        } = req.body;

        const newLog = new Log({
             title,
            linkSentry,
            project,
            type,
            status,
            platform,
            filename,
            function: functionName,
            priority,
            count,
            firstSeen,
            lastSeen
        });
        await newLog.save();

        res.status(201).json({ msg: 'Log creado exitosamente', log: newLog });
    } catch (err) {
        res.status(500).json({ msg: 'Error creando Log', error: err.message });
    }
};

module.exports = {
    getAllLogs,
    getLogById,
    createLog,
    updateLog,
    deleteLog
};