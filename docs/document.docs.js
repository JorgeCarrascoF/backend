/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Endpoints para gestión de documentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del documento
 *         title:
 *           type: string
 *           description: Título del documento
 *         content:
 *           type: string
 *           description: Contenido del documento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del documento
 *         log:
 *           type: object
 *           description: Log asociado al documento
 *           properties:
 *             id:
 *               type: string
 *               description: ID del log
 *             message:
 *               type: string
 *               description: Mensaje del log
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del registro
 *     DocumentInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - log
 *       properties:
 *         title:
 *           type: string
 *           description: Título del documento
 *           example: "Título del Documento"
 *         content:
 *           type: string
 *           description: Contenido del documento
 *           example: "Contenido del documento..."
 *         log:
 *           type: string
 *           description: ID del log asociado
 *           example: "60d5ec9f8c3da2b348d27e4a"
 */

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Crear un nuevo documento
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentInput'
 *     responses:
 *       201:
 *         description: Documento created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Error in data validation
 *   get:
 *     summary: Obtener todos los documentos
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Número de registros por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *         description: Orden de clasificación (ascendente o descendente)
 *     responses:
 *       200:
 *         description: Lista de documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 */

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Obtener un documento por ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del documento
 *     responses:
 *       200:
 *         description: Document found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *   patch:
 *     summary: Actualizar un documento
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del documento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentInput'
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *   delete:
 *     summary: Eliminar un documento
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del documento
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 */
