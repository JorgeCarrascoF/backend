// ============================================
// services/authService.js
// ============================================
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");
const User = require("../models/user");
const { sendEmail } = require("../config/email");
const { registrationEmail } = require("../templates/registrationEmail");
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

class AuthService {
  async registerUser(userData) {
    const { fullName, username, email, password, role, roleId } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ username }, { userName: username }, { email }],
    });

    if (existingUser) {
      if (
        existingUser.username === username ||
        existingUser.userName === username
      ) {
        throw boom.conflict("Username already exists");
      }
      if (existingUser.email === email) {
        throw boom.conflict("Email is already registered");
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validar y configurar el rol
    let finalRoleId = roleId;
    let finalRole = role || "user";

    if (roleId) {
      const Role = require("../models/role");
      const roleExists = await Role.findById(roleId);
      if (!roleExists) {
        throw boom.badRequest("The specified role does not exist");
      }
      // Mapear nombres de roles a códigos internos
      if (roleExists.name === "Administrador") {
        finalRole = "admin";
      } else if (roleExists.name === "SuperAdministrador") {
        finalRole = "superadmin";
      }
    }

    // Crear nuevo usuario
    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role: finalRole,
      roleId: finalRoleId,
    });

    await user.save();
    await user.populate("roleId", "name permission");

    // Enviar correo con los datos de registro
    try {
      const emailHtml = registrationEmail({
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        password: password,
      });
      const emailSent = await sendEmail(
        email,
        "Welcome to Buggle!",
        emailHtml
      );
      if (!emailSent) {
        console.warn(`Failed to send welcome email to ${email}`);
      }
    } catch (error) {
      console.error(
        `Unexpected error sending email to ${email}:`,
        error.message
      );
    }

    return {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      roleInfo: user.roleId,
    };
  }

  async loginUser(identifier, password) {
    // Buscar usuario por username o email
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { userName: identifier },
        { email: identifier },
      ],
    });

    if (!user) {
      console.log("User not found");
      throw boom.unauthorized("Invalid credentials");
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      throw boom.unauthorized("Invalid credentials");
    }

    // Poblar información del rol
    await user.populate("roleId", "name permission");

    console.log("- User role:", user.role);

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username || user.userName,
        email: user.email,
        role: user.role || "user",
        roleId: user.roleId?._id,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username || user.userName,
        email: user.email,
        role: user.role || "user",
        roleInfo: user.roleId
          ? {
              id: user.roleId._id,
              name: user.roleId.name,
              permission: user.roleId.permission,
            }
          : null,
      },
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw boom.notFound("User not found");
    }
    return user;
  }
}

module.exports = new AuthService();
