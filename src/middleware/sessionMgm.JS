const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = session({
  name: "session", //The name of the cookie that will be stored on the client-side.
  resave: true, //Forces the session to be saved back to the session store.
  saveUninitialized: true, // Forces a session that is “uninitialized” to be saved to the session store.
  secret: "secret-hello-world", //This is the secret used to sign the ID cookie.
  httpOnly: true, //Specifies the value of httpOnly Set-Cookie attribute.

  store: MongoStore.create({
    mongoUrl: process.env.DB_CNN,
    dbName: process.env.DB_CNN_SESSION,
    collectionName: process.env.DB_CNN_SESSION_NAME,
    touchAfter: 24 * 3600, // time period in seconds
    ttl: 1 * 24 * 60 * 60, //1 dia
    autoRemove: "native",
  }),
  // store: new MongoStore({ mongooseConnection: mongoose.connection }),
});
