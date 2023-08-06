const router = require("express").Router();
const { check } = require("express-validator");
const { validateFields } = require("../middleware/validate-fields");

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
    validateFields,
  ],
  newUser
);
router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("role").not().isEmpty(),
    validateFields,
  ],
  updUser
);
router.delete(
  "/",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  delUser
);
module.exports = router;
