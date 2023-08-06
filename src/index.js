const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
  encoding: "latin1",
});

 
require("./db");
const app = require("./server");
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log("Environment:", process.env.NODE_ENV);
});
