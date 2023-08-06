const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

// const MONGODB_URI =  `mongodb://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}@${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_SESSION}`;

module.exports = session({
  name: "session",
  resave: false, //don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: "secret-hello-world",

  store: MongoStore.create({
    mongoUrl: process.env.DB_CNN,
    dbName: process.env.DB_CNN_SESSION_NAME,
    collectionName: process.env.DB_CNN_SESSION_NAME,
    touchAfter: 24 * 3600, // time period in seconds
    ttl: 1 * 24 * 60 * 60, //1 dia
    autoRemove: "native",
  }),
  // store: new MongoStore({ mongooseConnection: mongoose.connection }),
});
