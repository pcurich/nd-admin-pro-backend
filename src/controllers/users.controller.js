const { response, request } = require("express");
const { paginate } = require("../helpers/db-paginate");
const {
  getAll,
  getOne,
  postDto,
  putDto,
  delDto,
} = require("../service/user.service");
const { interceptor, R200, R404 } = require("../helpers/response");

const getUsers = async (req = request, res = response) => {
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

const getUser = async (req = request, res = response) => {
  const { id } = req.params;
  const payload = { _id: id };
  const result = await getOne(payload);
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "User", result.message)
    );
  }
};

const newUser = async (req = request, res = response) => {
  const userId = req.user._id;

  const { userName, firstName, lastName, dni, picture, rol, email, password } =
    req.body;

  const result = await postDto(
    { userName, firstName, lastName, dni, picture, rol, email, password },
    userId
  );

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "User created"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "User", result.message)
    );
  }
};

const updUser = async (req = request, res = response) => {
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
    return interceptor(res, result).json(R200(result.data, "User updated"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "User", result.message)
    );
  }
};

const delUser = async (req = request, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const result = await delDto(id, userId);

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "User deleted"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "User", result.message)
    );
  }
};

module.exports = {
  getUsers,
  getUser,
  newUser,
  updUser,
  delUser,
};
