const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middleware/validate-fields");

const isAuthenticated   = require("../middleware/authJwt").isAuthenticated;

const {
  getDoctors,
  searchDoctor,
  newDoctor,
  updDoctor,
  delDoctor,
  getDoctorById,
} = require("../controllers/doctors.controller");

const router = Router();

router.get("/", isAuthenticated, getDoctors);

router.post(
  "/",
  [
    isAuthenticated,
    check("name").not().isEmpty(),
    check("hospital").isMongoId(),
    validateFields,
  ],
  newDoctor
);

router.put(
  "/:id",
  [
    isAuthenticated,
    check("name").not().isEmpty(),
    check("hospital").isMongoId(),
    validateFields,
  ],
  updDoctor
);

router.delete("/:id", isAuthenticated, delDoctor);

router.get("/:id", isAuthenticated, getDoctorById);
router.get("/:search", isAuthenticated, searchDoctor);

module.exports = router;
