let HttpStatus = require("http-status-codes");
const { R401 } = require("../helpers/response");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res
      .status(HttpStatus.StatusCodes.UNAUTHORIZED)
      .json(R401("JWT", "NO TOKEN", "No se ha autenticado."));
  }
};

module.exports.isAuthenticated = isAuthenticated;
