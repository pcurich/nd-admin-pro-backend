const path = require("path");
const colors = require("colors");
const args = require("yargs").argv;

require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
  encoding: "utf8",
});

require("./db");
const app = require("./server");
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
  console.log("JWT_SECRET:", process.env.JWT_SECRET.rainbow);
  console.log("Environment:", process.env.NODE_ENV.rainbow);
});
