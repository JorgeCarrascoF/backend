// controllers/userController.js
const userService = require("../services/userServices");
const { updateUserSchema } = require("../validations/userSchema");
const mongoose = require("mongoose");
const Boom = require("@hapi/boom");
const User = require("../models/user");

// Las definiciones de Swagger no cambian, por lo que se omiten por brevedad...
const Sentry = require("../instrument"); // Importar Sentry

const getUsersByFilter = async (req, res) => {
  try {
    // Solo superadmin, admin y usuarios pueden ver la lista de usuarios
    if (!["superadmin", "admin", "user"].includes(req.user.role)) {
      return res.status(403).json({
        msg: "Acceso denegado. Rol no autorizado.",
      });
    }

    const filters = {
      username: req.query.username,
      email: req.query.email,
      role: req.query.role,
      isActive: req.query.isActive,
      search: req.query.search,
    };
    const pagination = {
      limit: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
    };

    const { data, count } = await userService.getUsersByFilter(
      filters,
      pagination
    );

    res.status(200).json({
      success: true,
      page: pagination.page,
      limit: pagination.limit,
      count: data.length,
      total: count,
      data: data,
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error en controller getUsersByFilter:", err);
    res
      .status(500)
      .json({
        msg: "Error del servidor al filtrar usuarios",
        error: err.message,
      });
  }
};

const getUserById = async (req, res) => {
  try {
    // Validar formato del ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "El ID proporcionado no es válido." });
    }
    // Superadmin puede ver cualquier usuario
    // Admin puede ver cualquier usuario
    // Usuario normal solo puede verse a sí mismo
    if (req.user.role === "user" && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: "Acceso denegado." });
    }

    const user = await userService.getUserById(req.params.id);
    // Enviar respuesta HTTP
    res.status(200).json(user);
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error en controller getUserById:", err);
    if (err.message === "Usuario no encontrado.") {
      return res.status(404).json({ msg: err.message });
    }
    res
      .status(500)
      .json({
        msg: "Error del servidor al obtener el usuario",
        error: err.message,
      });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Solo superadmin puede actualizar cualquier usuario
    // Admin solo puede actualizar usuarios que no sean superadmin
    // Usuario normal solo puede actualizarse a sí mismo
    if (req.user.role === "user" && req.user.id !== id) {
      return res
        .status(403)
        .json({ msg: "Acceso denegado para actualizar este usuario." });
    }

    if (req.user.role === "admin") {
      // Verificar que no esté intentando actualizar a un superadmin
      const targetUser = await userService.getUserById(id);
      if (targetUser.role === "superadmin") {
        return res
          .status(403)
          .json({
            msg: "Los administradores no pueden modificar usuarios superadmin.",
          });
      }
    }

    // Solo superadmin puede cambiar roles
    if (req.user.role !== "superadmin") {
      delete updateData.role;
      delete updateData.roleId;
    }

    const updatedUser = await userService.updateUser(id, updateData);

    res.status(200).json({
      msg: "Usuario actualizado exitosamente.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error en controller updateUser:", err);
    if (err.isBoom) {
      // Todos los errores ahora son Boom
      return res.status(err.output.statusCode).json({
        msg: err.output.payload.message,
        details: err.data?.details,
      });
    }
    // Error genérico (no debería ocurrir si todo está bien)
    res.status(500).json({
      msg: "Error del servidor al actualizar el usuario",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Solo superadmin puede eliminar usuarios
    if (req.user.role !== "superadmin") {
      return res
        .status(403)
        .json({
          msg: "Solo los superadministradores pueden eliminar usuarios.",
        });
    }

    // Verificar que no se esté eliminando a sí mismo
    if (req.user.id === req.params.id) {
      return res
        .status(400)
        .json({ msg: "No puedes eliminar tu propia cuenta." });
    }

    const deletedUser = await userService.deleteUser(req.params.id);

    res.status(200).json({
      msg: "Usuario eliminado exitosamente.",
      deletedUser: deletedUser,
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error en controller deleteUser:", err);
    if (err.message === "Usuario no encontrado.") {
      return res.status(404).json({ msg: err.message });
    }
    res
      .status(500)
      .json({
        msg: "Error del servidor al eliminar el usuario",
        error: err.message,
      });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    // Validar que se proporcionen las contraseñas
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          msg: "Debe proporcionar la contraseña actual y la nueva contraseña.",
        });
    }

    // Validar que la nueva contraseña cumpla con los requisitos
    const { error } = updateUserSchema.validate({ password: newPassword });
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    // Verificar que la contraseña actual es correcta
    const user = await userService.getUserById(id);
    const isMatch = await userService.comparePassword(currentPassword, id);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "La contraseña actual es incorrecta." });
    }

    // Actualizar la contraseña
    await userService.updatePassword(id, newPassword);

    res.status(200).json({ msg: "Contraseña cambiada exitosamente." });
  } catch (err) {
    console.error("Error en controller changePassword:", err);
    if (err.isBoom) {
      return res.status(err.output.statusCode).json({
        msg: err.output.payload.message,
        details: err.data?.details,
      });
    }
    res
      .status(500)
      .json({
        msg: "Error del servidor al cambiar la contraseña",
        error: err.message,
      });
  }
};

module.exports = {
  getUsersByFilter,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
};
