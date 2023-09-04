const { Router } = require("express");
const passport = require("passport");
require("../config/strategy-jwt")(passport);
const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const {
  localSignIn, 
  googleSignIn,
  renewToken,
  findByEmail,
  findById,
  changePassword,
} = require("../controllers/auth.controller");
const { check } = require("express-validator");
const { validateFields } = require("../middleware/fields-validate");

const router = Router();

router.post(
  "/localSignIn",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields,
  ],
  localSignIn
);

router.post(
  "/googleSignIn",
  [
    check("token", "El token de Google es obligatorio").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
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
