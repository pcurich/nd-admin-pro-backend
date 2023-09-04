const { response } = require("express");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu");
const passport = require("../helpers/password");
const {
  interceptor,
  R200JWT,
  R200,
  R401,
  R500,
} = require("../helpers/response");
const {
  signInUser,
  createUser,
  findUserByEmail,
  findUserById,
  changePasswordUser,
  renewTokenUser,
} = require("../service/auth.service");

const { postDto, putDto, getByEmail } = require("../service/user.service");

const localSignIn = async (req, res = response) => {
  const { email, password } = req.body;
  const result = await signInUser(email, password);
  try {
    if (result.status) {
      const jwt = passport.issueJWT(result.data);
      console.log("PCURICH=", jwt);
      return interceptor(res, result).json(
        R200JWT(
          { user: result.data, token: jwt.token, expiresIn: jwt.expiresIn },
          "JWT"
        )
      );
    } else {
      return interceptor(res, result).json(
        R401(result.code, "Error in Sign In", result.message)
      );
    }
  } catch (err) {
    return interceptor(res, result).json(
      R500(result.code, "Error in Sign In", JSON.stringify(err))
    );
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;
  const { firstName, lastName, email, picture } = await googleVerify(
    googleToken
  );
  let result = {};
  const userDB = await getByEmail(email);
  console.log("userDB :>> ", userDB);

  if (!userDB.data) {
    result = await postDto(
      email,
      firstName,
      lastName,
      "00000000",
      email,
      "@@@",
      !picture ? "default.png" : picture,
      "USER_ROLE",
      true
    );
  } else {
    result = await putDto(userDB.data.id, {
      firstName,
      lastName,
      picture,
      state: true,
      google: true,
    });
  }

  if (result?.status && result?.data) {
    console.log("result :>> ", result);
    return interceptor(res, result).json(
      R200(result.data, "Usuario en sesion ")
    );
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Users", result.message)
    );
  }
};

const renewToken = async (req, res = response) => {
  console.log("PCURICH", req.params);
  const id = req.params.id;
  const token = await password.validJWT(id);
  const user = await renewTokenUser(id);
  const menu = getMenuFrontEnd(user.role);
  res.json({ token, user, menu });
};

const findByEmail = async (req, res = response) => {
  const { email } = req.body;
  const result = await findUserByEmail(email);

  if (result != undefined && result.status && result.data != undefined) {
    return interceptor(res, result).json(
      R200(result.data, "Usuario encontrado")
    );
  } else {
    return interceptor(res, result).json(
      R401(result.code, "No se pudo encontrar al usuario", result.message)
    );
  }
};

const findById = async (req, res = response) => {
  const { id } = req.body;
  const result = await findUserById(id);

  if (result != undefined && result.status && result.data != undefined) {
    return interceptor(res, result).json(
      R200(result.data, "Usuario encontrado")
    );
  } else {
    return interceptor(res, result).json(
      R401(result.code, "No se pudo encontrar al usuario", result.message)
    );
  }
};

const changePassword = async (req, res = response) => {
  const { email, newPassword } = req.body;
  const result = await changePasswordUser(email, newPassword);

  if (result != undefined && result.status && result.data != undefined) {
    return interceptor(res, result).json(
      R200(result.data, "Contraseña cambiada")
    );
  } else {
    return interceptor(res, result).json(
      R401(result.code, "No se pudo cambiar la contraseña", result.message)
    );
  }
};

module.exports = {
  localSignIn,
  googleSignIn,

  renewToken,
  findByEmail,
  findById,
  changePassword,
};
