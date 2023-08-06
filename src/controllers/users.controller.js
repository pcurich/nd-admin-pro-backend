const { response } = require("express");
const { paginate } = require("../helpers/db");
const { getAll } = require("../service/user.service");
const { interceptor, R200, R404 } = require("../helpers/response");

const getUsers = async (req, res = response) => {
  const { limit, page } = paginate(req);
  const result = await getAll(limit, page);

  if (result != undefined && result.status && result.data != undefined) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Users", "No se puede leer a los usuarios")
    );
  }
};

const newUser = async (req, res = response) => {
  const userId = req.user._id;
  const {
    userName,
    firstName,
    lastName,
    dni,
    state,
    picture,
    rolId,
    email,
    password,
  } = req.body;

  const result = await postDto(
    userName,
    firstName,
    lastName,
    dni,
    email,
    password,
    state,
    !picture ? "default.png" : picture,
    rolId,
    userId
  );

  if (result != undefined && result.status && result.data != undefined) {
    return interceptor(res, result).json(R200(result.data, "Usuario creado"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Users", result.message)
    );
  }
};

const updUser = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto

  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        msg: "No existe un usuario por ese id",
      });
    }

    const { password, google, email, ...campos } = req.body;

    if (userDB.email !== email) {
      const existEmail = await User.findOne({
        email,
      });

      if (existEmail) {
        return res.status(400).json({
          ok: false,
          msg: "El correo ya está registrado",
        });
      }
    }

    if (!userDB.google) {
      campos.email = email;
    } else if (userDB.email !== email) {
      return res.status(400).json({
        msg: "Usuario de google no pueden cambiar su correo",
      });
    }

    const userUpd = await User.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      user: userUpd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

const delUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        msg: "No existe un usuario por ese id",
      });
    }

    await User.findByIdAndDelete(uid);
    res.json({
      msg: "Usuario eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getUsers,
  newUser,
  updUser,
  delUser,
};
