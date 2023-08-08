const router = require("express").Router();
const { check } = require("express-validator");
const { validateFields } = require("../middleware/validateFields");
const {
  isRolValid,
  existEmail,
  existUserById,
} = require("../helpers/db-validators");

const isAuthenticated = require("../middleware/authJwt").isAuthenticated;
const passport = require("passport");
require("../helpers/password");
const {
  getUsers,
  newUser,
  updUser,
  delUser,
} = require("../controllers/users.controller");

router.get(
  "/:limit?/:page?",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  getUsers
);
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("name").not().isEmpty(),
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
    check("name").not().isEmpty(),
    check("email").isEmail(),
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
module.exports = { router };
