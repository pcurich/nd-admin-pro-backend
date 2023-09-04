const { response } = require("express");
const { paginate } = require("../helpers/db-paginate");
const { getAll, postDto, putDto, delDto } = require("../service/user.service");
const { interceptor, R200, R404 } = require("../helpers/response");

const getUsers = async (req, res = response) => {
  const { limit, page } = paginate(req);
  const result = await getAll(limit, page);
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Users", result.message)
    );
  }
};

const newUser = async (req, res = response) => {
  const userId = req.user._id;

  const { userName, firstName, lastName, dni, picture, rol, email, password } =
    req.body;

  const result = await postDto(
    userName,
    firstName,
    lastName,
    dni,
    email,
    password,
    !picture ? "default.png" : picture,
    rol,
    userId
  );

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Usuario creado"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Users", result.message)
    );
  }
};

const updUser = async (req, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const { firstName, lastName, dni, picture, state, rol } = req.body;

  const result = await putDto(
    id,
    {
      firstName,
      lastName,
      dni,
      picture,
      state,
      rol,
    },
    userId
  );

  if (result?.status && result?.data) {
    return interceptor(res, result).json(
      R200(result.data, "Usuario actualizado")
    );
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Users", result.message)
    );
  }
};

const delUser = async (req, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const result = await delDto(id, userId);

  if (result?.status && result?.data) {
    return interceptor(res, result).json(
      R200(result.data, "Usuario eliminado")
    );
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Users", result.message)
    );
  }
};

module.exports = {
  getUsers,
  newUser,
  updUser,
  delUser,
};
