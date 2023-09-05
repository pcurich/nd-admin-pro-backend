const { User, Rol } = require("../models");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const { email, userName } = req.body;
  try {
    const userByUserName = await User.findOne({ userName }).exec();
    if (userByUserName)
      return res.status(400).json({ message: "El usuario ya existe" });

    const userByEmail = await User.findOne({ email }).exec();
    if (userByEmail)
      return res.status(400).json({ message: "El correo ya esta en uso" });

    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const checkRolesExisted = async (req, res, next) => {
  const rols = await Rol.find().lean().exec();
  if (req.body.roles) {
    for (const element of req.body.roles) {
      if (!rols.includes(element)) {
        return res.status(400).json({
          message: `Rol ${element} no existe`,
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
