const { Rol } = require("../models");

const createRoles = async () => {
  let rols = await Rol.countDocuments({});
  console.log("Roles en Base de datos  :>> ", rols);
  if (rols == 0) {
    const ROLES = ["USER_ROLE", "ADMIN_ROLE", "WORKER_ROLE", "AGENT_ROLE"];
    ROLES.forEach(async (e) => {
      const rol = new Rol({
        name: e,
        state: true,
        canDelete: false,
      });
      await rol.save();
    });

    console.log("Roles creados satisfactoriamente", JSON.stringify(ROLES));
  }
};

module.exports = { createRoles };
