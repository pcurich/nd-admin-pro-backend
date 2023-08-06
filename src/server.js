const path = require("path");
const express = require("express");
var morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
var cors = require("cors");
require("./config/passportJWT");

// middleware
const accessLogStream = require("./middleware/log");
const sessionManagement = require("./middleware/sessionMgm");
const multerConfig = require("./middleware/multer");
const controlAccess = require("./middleware/cors");

// Initializations
const app = express();
app.set("trust proxy", 1); // trust first proxy
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * -------------- SESSION SETUP ----------------
 */
app.use(sessionManagement);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("combined"));

// settings
app.set("port", process.env.PORT);

// static files
app.use("/api", express.static(path.join(__dirname, "uploads")));

// middlewares
app.use(helmet());
// app.use(multerConfig);
app.use(accessLogStream);
app.use(cors());

/**
 * -------------- ROUTES ----------------
 */
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/hospitals", require("./routes/hospitals.routes"));
app.use("/api/doctors", require("./routes/doctors.routes"));
app.use("/api/media", require("./routes/media.routes"));

var route,
  routes = [];

app._router.stack.forEach(function (middleware) {
  if (middleware.route) {
    // routes registered directly on the app
    routes.push(middleware.route);
  } else if (middleware.name === "router") {
    // router middleware
    middleware.handle.stack.forEach(function (handler) {
      route = handler.route;
      route && routes.push(route);
    });
  }
});

routes.forEach(function (temp) {
  var methods = "";
  for (var method in temp.methods) {
    methods += method + ", ";
  }
  if (process.env.SH_ROUTE_LIST) {
    console.log("[" + methods + "]" + temp.path);
  }
});

module.exports = app;
