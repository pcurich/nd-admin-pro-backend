const router = require("express").Router();
const { check } = require("express-validator");
const { validateFields } = require("../middleware/fields-validate");
const {
  isRolValid,
  existEmail,
  existUserById,
} = require("../helpers/db-validators");

const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const passport = require("passport");
require("../helpers/password");
const {
  getUsers,
  getUser,
  newUser,
  updUser,
  delUser,
} = require("../controllers/users.controller");

router.get(
  "/",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  getUsers
);
router.get(
  "/:id",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  getUser
);

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("userName").not().isEmpty(),
    check("password").not().isEmpty(),
    check("email").isEmail(),
    check("email").custom(existEmail),
    check("rol").custom(isRolValid),
    validateFields,
  ],
  newUser
);

router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existUserById),
    check("userName").not().isEmpty(),
    validateFields,
  ],
  updUser
);

router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existUserById),
    validateFields,
  ],
  delUser
);

module.exports = router;
