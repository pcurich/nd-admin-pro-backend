const { Rol } = require("../models");

const createRoles = async () => {
  let rols = Rol.countDocuments({});
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

    const rolWorker = new Rol({
      name: "WORKER_ROLE",
      state: true,
      canDelete: false,
    });

    const rolAgent = new Rol({
      name: "AGENT_ROLE",
      state: true,
      canDelete: false,
    });

    await rolAdmin.save();
    await rolUser.save();

    console.log("Roles creados satisfactoriamente", [
      rolAdmin,
      rolUser,
      rolWorker,
      rolAgent,
    ]);
  }
};

module.exports = { createRoles };
