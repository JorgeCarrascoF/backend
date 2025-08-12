/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - sentry_project_id
 *         - name
 *         - slug
 *         - is_active
 *         - created_at
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del Project
 *         sentry_project_id:
 *           type: string
 *           description: ID del proyecto en Sentry
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         slug:
 *           type: string
 *           description: Identificador único del proyecto (slug)
 *         platform:
 *           type: string
 *           description: Plataforma del proyecto
 *         is_active:
 *           type: boolean
 *           enum: ['true', 'false']
 *           description: Indica si el proyecto está activo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del proyecto
 */


/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Obtener todos los proyectos (con filtros y paginación)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda global por múltiples campos
 *       - in: query
 *         name: sentry_project_id
 *         schema:
 *           type: string
 *         description: ID del proyecto en Sentry
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del proyecto
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Identificador único del proyecto (slug)
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: Plataforma del proyecto
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *           enum: ['true', 'false']
 *         description: Indica si el proyecto está activo
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Actualizar un proyecto existente
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       404:
 *         description: Proyecto no encontrado
 */

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       404:
 *         description: Proyecto no encontrado
 */
