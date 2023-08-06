var cors = require("cors");

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    //caso particular de postman
    console.log(origin);
    if (typeof origin === "undefined") {
      callback(null, true);
    } else {
      //Revisar si la peticion viene de un servidor que esta en la lisya blanca
      const exist = String(whiteList)
        .split(",")
        .some((dominio) => dominio === origin);
      if (exist) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS " + origin));
      }
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
  maxAge: 3600,
};

module.exports = cors(corsOptions);
