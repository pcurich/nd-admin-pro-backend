const Rol = require("../models/Rol");
const User = require("../models/User");

const isRolValid = async (name = "") => {
  const isRole = await Rol.findOne({ name }).exec();
  if (!isRole) {
    throw new Error(`El rol ${name} no está registrado en la BD`);
  }
};

const existEmail = async (email = "") => {
  const isEmail = await User.findOne({ email }).exec();
  if (isEmail) {
    throw new Error(`El correo: ${email}, ya está registrado`);
  }
};

const existUserById = async (id) => {
  // Verificar si el correo existe
  const isUser = await User.findById(id).exec();
  if (!isUser) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  isRolValid,
  existUserById,
  existEmail,
};
