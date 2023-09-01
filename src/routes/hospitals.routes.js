const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middleware/fields-validate");
const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const {
  getHospitals,
  newHospital,
  updHospital,
  delHospital,
} = require("../controllers/hospitals.controller");

const router = Router();

router.get("/", getHospitals);

router.post(
  "/",
  [isAuthenticated, check("name").not().isEmpty(), validateFields],
  newHospital
);

router.put(
  "/:id",
  [isAuthenticated, check("name").not().isEmpty(), validateFields],
  updHospital
);

router.delete("/:id", isAuthenticated, delHospital);

module.exports = router;
