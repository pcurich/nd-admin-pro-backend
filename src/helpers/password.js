const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken"); 
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "../id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return { salt: salt, hash: genHash };
}

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function issueJWT(user) {
  const id = user.id;
  const payload = { sub: id, iat: Date.now() };
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: "1d",
    algorithm: "RS256",
  });
  return {
    token: (
      (process.env.JWT_SECRET_HEADER_PREFIX || "") +
      " " +
      signedToken
    ).trim(),
    expiresIn: "1d",
  };
}

function validJWT(req) {
  // Leer el Token
  const header = req.header(process.env.JWT_SECRET_HEADER);
  console.log("pcurich=header=", header);
  console.log("pcurich=header=!== undefined", header !== undefined);
  console.log('pcurich=header=!== ""', header !== "");
  console.log(header !== undefined && header !== "");
  if (header !== undefined && header !== "") {
    const token = header.split(" ")[1].trim();
    const payload = jsonwebtoken.decode(token);
    console.log("payload=", payload);
    return payload.sub;
  }
  return undefined;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.validJWT = validJWT;
