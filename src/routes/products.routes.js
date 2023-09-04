const { Router } = require("express");
const { check } = require("express-validator");
const passport = require("passport");
require("../config/strategy-jwt")(passport);
const isAuthenticated = require("../middleware/auth-jwt").isAuthenticated;
const { validateFields } = require("../middleware/fields-validate");

const router = Router();

module.exports = router;
