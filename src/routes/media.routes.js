const router = require("express").Router();
const expressFileUpload = require("express-fileupload");
const isAuthenticated = require("../middleware/authJwt").isAuthenticated;
const passport = require("passport");
const { upload } = require("../controllers/media.controller");

router.use(expressFileUpload());

router.put(
  "/:table/:id",
  [passport.authenticate("jwt", { session: true }), isAuthenticated],
  upload
);

module.exports = router;
