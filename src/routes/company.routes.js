const router = require("express").Router();
const { check } = require("express-validator");
const { validateFields } = require("../middleware/fields-validate");
const { existCompanyById, existUserById } = require("../helpers/db-validators");
const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const passport = require("passport");
require("../helpers/password");

const {
  getCompanies,
  getCompany,
  newCompany,
  updCompany,
  delCompany,
  addAgent,
  rmAgent,
} = require("../controllers/companies.controller");

router.get(
  "/",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  getCompanies
);

router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existCompanyById),
  ],
  getCompany
);

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("name", "El nombre es requerido").not().isEmpty(),
    check("documentValue", "El valor del documento es requerido")
      .not()
      .isEmpty(),
    validateFields,
  ],
  newCompany
);

router.post(
  "/add-agent/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("companyId", "No es un ID valido").isMongoId(),
    check("companyId").custom(existCompanyById),
    validateFields,
  ],
  addAgent
);

router.post(
  "/rm-agent/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("companyId", "No es un ID valido").isMongoId(),
    check("companyId").custom(existCompanyById),
    check("user.id", "No es un ID valido").isMongoId(),
    check("user.id").custom(existUserById),
    validateFields,
  ],
  rmAgent
);

router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existCompanyById),
    validateFields,
  ],
  updCompany
);

router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existCompanyById),
    validateFields,
  ],
  delCompany
);

module.exports = router;
