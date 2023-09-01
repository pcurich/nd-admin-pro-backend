let HttpStatus = require("http-status-codes");
const util = require("../helpers/password");

/* Successful */

const R200 = (data, message, status = HttpStatus.StatusCodes.OK) => {
  return {
    status,
    data,
    message,
  };
};

const R200JWT = (data, message, status = HttpStatus.StatusCodes.OK) => {
  return {
    status,
    data,
    message,
  };
};

/* Successful */

/* Client Error */

const R400 = (
  code,
  title,
  details,
  status = HttpStatus.StatusCodes.BAD_REQUEST
) => {
  return {
    status,
    note: "Server didn't understand the URL you gave it",
    data: {},
    message: {
      code: code,
      title: title,
      details: details,
    },
  };
};

const R401 = (
  code,
  title,
  details,
  status = HttpStatus.StatusCodes.UNAUTHORIZED
) => {
  return {
    status,
    note: "Must be authenticated",
    data: {},
    message: {
      code: code,
      title: title,
      details: details,
    },
  };
};

const R404 = (
  code,
  title,
  details,
  status = HttpStatus.StatusCodes.NOT_FOUND
) => {
  return {
    status,
    note: "A file doesn't exist at that address",
    data: {},
    message: {
      code: code,
      title: title,
      details: details,
    },
  };
};

/* Client Error */

/* Server Error */

const R500 = (
  code,
  title,
  details,
  status = HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR
) => {
  return {
    status,
    note: "Something on the server didn't work right.",
    data: {},
    message: {
      code: code,
      title: title,
      details: details,
    },
  };
};

/* Server Error */

/**
 * Manejo interno dentro de la aplicacion
 */
const result200 = (data, message) => {
  console.log("PCURICH = " + message, data);
  return {
    status: true,
    data,
    code: HttpStatus.StatusCodes.OK,
    message,
  };
};

const result400 = (message) => {
  console.log("PCURICH = " + message, {});
  return {
    status: false,
    data: undefined,
    code: HttpStatus.StatusCodes.NOT_FOUND,
    message,
  };
};

const result500 = (message, err = undefined) => {
  console.error("PCURICH = " + message, err);
  return {
    status: false,
    data: undefined,
    code: HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
    message,
  };
};

const interceptor = (res, result) => {
  const JWT_SECRET_HEADER = process.env.JWT_SECRET_HEADER;
  if (result.data === undefined) {
    return res.header(JWT_SECRET_HEADER, result.data).status(result.code);
  } else {
    const jwt = util.issueJWT(result.data);
    return res.header(JWT_SECRET_HEADER, jwt.token).status(result.code);
  }
};

module.exports = {
  interceptor,
  result200,
  result400,
  result500,
  R200,
  R200JWT,
  R400,
  R401,
  R404,
  R500,
};
