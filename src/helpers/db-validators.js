const { User, Rol, Category, Company, Office } = require("../models");

const isRolValid = async (name = "") => {
  const isRole = await Rol.findOne({ name }).exec();
  if (!isRole) throw new Error(`El rol ${name} no está registrado en la BD`);
};

const existEmail = async (email = "") => {
  const isEmail = await User.findOne({ email }).exec();
  if (isEmail) throw new Error(`El correo: ${email}, ya está registrado`);
};

const existUserById = async (id) => {
  const isEntity = await User.findById(id).exec();
  if (!isEntity) throw new Error(`El id no existe ${id}`);
};

const existCategoryById = async (id) => {
  const isEntity = await Category.findById(id).exec();
  if (!isEntity) throw new Error(`El id no existe ${id}`);
};

const existCompanyById = async (id) => {
  const isEntity = await Company.findById(id).exec();
  if (!isEntity) throw new Error(`El id no existe ${id}`);
};

const existOfficeById = async (id) => {
  const isEntity = await Office.findById(id).exec();
  if (!isEntity) throw new Error(`El id no existe ${id}`);
};

module.exports = {
  isRolValid,
  existUserById,
  existCategoryById,
  existEmail,
  existCompanyById,
  existOfficeById,
};
