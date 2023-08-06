const { Router } = require("express");
const passport = require("passport");
require("../config/passportJWT")(passport);
const isAuthenticated = require("../middleware/authJwt").isAuthenticated;
const {
  signIn,
  create,
  googleSignIn,
  renewToken,
  findByEmail,
  findById,
  changePassword,
} = require("../controllers/auth.controller");
const { check } = require("express-validator");
const { validateFields } = require("../middleware/validate-fields");

const router = Router();

router.post(
  "/signIn",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  signIn
);

router.post(
  "/findByEmail",
  [check("email", "El email es obligatorio").isEmail(), validateFields],
  findByEmail
);

router.post(
  "/findById",
  [check("id", "El id es obligatorio").not().isEmpty(), validateFields],
  findById
);

router.post(
  "/createUser",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("userName", "El nombre de usuario es obligatorio").not().isEmpty(),
    check("lastName", "El apellido es obligatorio").not().isEmpty(),
    check("firstName", "El nombre es obligatorio").not().isEmpty(),
    check("dni", "El dni es obligatorio").not().isEmpty(),
    validateFields,
  ],
  create
);

router.post(
  "/google",
  [
    check("token", "El token de Google es obligatorio").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

router.post(
  "/changePassword",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("email", "El email es obligatorio").isEmail(),
    check("newPassword", "La nueva contraseña es obligatorio").not().isEmpty(),
    validateFields,
  ],
  changePassword
);

router.get("/renewToken/:id", renewToken);

module.exports = router;
