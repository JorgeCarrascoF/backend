/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - title
 *         - project
 *         - type
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         linkSentry:
 *           type: string
 *         project:
 *           type: string
 *         type:
 *           type: string
 *           enum: [solved, unresolved]
 *         status:
 *           type: string
 *           enum: [error, warning, info]
 *         platform:
 *           type: string
 *         filename:
 *           type: string
 *         function:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [high, medium, low]
 *         count:
 *           type: integer
 *         firstSeen:
 *           type: string
 *           format: date-time
 *         lastSeen:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * /logs:
 *   get:
 *     summary: "Obtener todos los Logs u obtener logs filtrados por paginación"
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
 *         description: Página de resultados (paginación)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda global por múltiples campos
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filtrar por título exacto del log
 *       - in: query
 *         name: linkSentry
 *         schema:
 *           type: string
 *         description: Filtrar por enlace de Sentry
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de proyecto
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
 *         description: Filtrar por plataforma del sistema
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de archivo
 *       - in: query
 *         name: functions
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de la función
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
 *                   example: 3
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
 *               msg: "Acceso denegado. Solo tienen acceso los administradores, desarrolladores o QA's."
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


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


/**
 * @swagger
 * /logs/{id}:
 *   patch:
 *     summary: "Actualizar un Log"
 *     description: Actualiza un Log. Solo accesible para administradores.
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


/**
 * @swagger
 * /logs/{id}:
 *   delete:
 *     summary: "Eliminar un Log"
 *     description: Elimina un Log. Solo accesible para administradores.
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


/**
 * @swagger
 * /logs:
 *   post:
 *     summary: "Crear nuevo log"
 *     description: Crea un Log. Solo accesible para administradores.
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
