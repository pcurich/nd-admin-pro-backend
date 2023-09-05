const { Router } = require("express");
const { check } = require("express-validator");
const passport = require("passport");
require("../config/strategy-jwt")(passport);
const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const { validateFields } = require("../middleware/fields-validate");
const { existCategoryById } = require("../helpers/db-validators");

const {
  newCategory,
  getCategories,
  getCategory,
  updCategory,
  delCategory,
} = require("../controllers/categories.controller");

const router = Router();

router.get(
  "/",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  getCategories
);

router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  getCategory
);

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  newCategory
);

router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existCategoryById),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  updCategory
);

router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    validateFields,
  ],
  delCategory
);

module.exports = router;
