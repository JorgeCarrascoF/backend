/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - repo
 *         - github_token
 *         - created_at
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del Project
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         repo:
 *           type: string
 *           description: URL del proyecto
 *         branch:
 *           type: string
 *           description: Rama del repositorio
 *         github_token:
 *           type: string
 *           description: Token para administrar el proyecto
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del proyecto
 *
 *     ProjectCreate:
 *       type: object
 *       required:
 *         - name
 *         - repo
 *         - github_token
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         repo:
 *           type: string
 *           description: URL del proyecto
 *         branch:
 *           type: string
 *           description: Rama del repositorio
 *         github_token:
 *           type: string
 *           description: Token para administrar el proyecto
 *
 *     ProjectUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         repo:
 *           type: string
 *         branch:
 *           type: string
 *         github_token:
 *           type: string
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del proyecto
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
 *         description: Unprovided or invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
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
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
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
 *             $ref: '#/components/schemas/ProjectCreate'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid data
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
 *             $ref: '#/components/schemas/ProjectUpdate'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
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
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
