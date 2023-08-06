const User = require("../models/User");
const Rol = require("../models/Rol");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const { email, userName } = req.body;
  try {
    const userByUserName = await User.findOne({ userName });
    if (userByUserName)
      return res.status(400).json({ message: "El usuario ya existe" });

    const userByEmail = await User.findOne({ email });
    if (userByEmail)
      return res.status(400).json({ message: "El correo ya esta en uso" });

    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const checkRolesExisted = async (req, res, next) => {
  const rols = await Rol.find().lean();
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!rols.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Rol ${req.body.roles[i]} no existe`,
        });
      }
    }
  }

  next();
};

module.export = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
