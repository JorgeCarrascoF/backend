// ============================================
// controllers/roleController.js (CORREGIDO)
// ============================================
const Role = require('../models/Role');

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crear nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
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
 *         description: Rol creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
const createRole = async (req, res) => {
    const { name, permission } = req.body;

    if (!name || !permission) {
        return res.status(400).json({ msg: 'Name y permission son requeridos' });
    }

    try {
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ msg: 'El rol ya existe' });
        }

        const newRole = new Role({
            name,
            permission: Array.isArray(permission) ? permission : [permission]
        });

        await newRole.save();
        res.status(201).json({ msg: 'Rol creado exitosamente', role: newRole });
    } catch (err) {
        res.status(500).json({ msg: 'Error creando rol', error: err.message });
    }
};

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles
 */
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ msg: 'Error obteniendo roles', error: err.message });
    }
};

module.exports = { createRole, getAllRoles };