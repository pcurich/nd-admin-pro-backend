const Rol = require("../models/Rol");

const createRoles = async () => {
  let rols = await Rol.countDocuments({});
  if (rols == 0) {
    const rolUser = new Rol({
      name: "USER_ROLE",
      state: true,
      canDelete: false,
    });

    const rolAdmin = new Rol({
      name: "ADMIN_ROLE",
      state: true,
      canDelete: false,
    });

    await rolAdmin.save();
    await rolUser.save();

    console.log("Roles creados satisfactoriamente", [rolAdmin, rolUser]);
  }
};

module.exports = { createRoles };
