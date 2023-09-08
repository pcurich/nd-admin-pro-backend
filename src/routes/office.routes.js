const router = require("express").Router();
const { check } = require("express-validator");
const { validateFields } = require("../middleware/fields-validate");
const {
  existCompanyById,
  existUserById,
  existOfficeById,
} = require("../helpers/db-validators");
const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const passport = require("passport");
require("../helpers/password");

const {
  getOffices,
  getOffice,
  newOffice,
  updOffice,
  delOffice,
  addWorker,
  rmWorker,
} = require("../controllers/offices.controller");

router.get(
  "/",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  getOffices
);

router.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existOfficeById),
  ],
  getOffice
);

router.post(
  "/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("name", "El nombre es requerido").not().isEmpty(),
    check("address", "La dirección es requerida").not().isEmpty(),
    check("companyId").custom(existCompanyById),
    validateFields,
  ],
  newOffice
);

router.post(
  "/add-worker/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("officeId", "No es un ID valido").isMongoId(),
    check("officeId").custom(existOfficeById),
    validateFields,
  ],
  addWorker
);

router.post(
  "/rm-worker/",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("officeId", "No es un ID valido").isMongoId(),
    check("officeId").custom(existOfficeById),
    check("user.id", "No es un ID valido").isMongoId(),
    check("user.id").custom(existUserById),
    validateFields,
  ],
  rmWorker
);

router.put(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existOfficeById),

    validateFields,
  ],
  updOffice
);

router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: true }),
    isAuthenticated,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existOfficeById),
    validateFields,
  ],
  delOffice
);

module.exports = router;
