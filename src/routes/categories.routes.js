const { Router } = require("express");
const { check } = require("express-validator");
const passport = require("passport");
require("../config/strategy-jwt")(passport);
const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const { validateFields } = require("../middleware/fields-validate");

const router = Router();

router.get("/:limit?/:page?", [
  passport.authenticate("jwt", { session: true }),
  isAuthenticated,
]);

router.get("/:id", [
  passport.authenticate("jwt", { session: true }),
  isAuthenticated,
]);

router.post("/", [
  passport.authenticate("jwt", { session: true }),
  isAuthenticated,
  validateFields,
]);

router.put("/:id", [
  passport.authenticate("jwt", { session: true }),
  isAuthenticated,
  check("id", "No es un ID valido").isMongoId(),
  validateFields,
]);

router.delete("/:id", [
  passport.authenticate("jwt", { session: true }),
  isAuthenticated,
  check("id", "No es un ID valido").isMongoId(),
  validateFields,
]);

module.exports = router;
