const fs = require("fs");
const path = require("path");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pathTokey = path.join(__dirname, "..", "../id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathTokey, "utf8");

const User = require("../models/User");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new JwtStrategy(options, (payload, done) => {
  console.log("PCURICH=pathTokey", pathTokey);
  User.findById(payload.sub)

    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err, null);
    });
});

module.exports = (passport) => {
  passport.use(strategy);
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
