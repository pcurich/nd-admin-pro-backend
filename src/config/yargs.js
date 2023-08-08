const argv = require("yargs")
  .option("p", {
    alias: "port",
    type: "number",
    demandOption: true,
    default: 3000,
    describe: "Es el pueto por donde inicia la aplicación",
  })
  .option("r", {
    alias: "router",
    type: "boolean",
    demandOption: false,
    default: false,
    describe: "Muestra la lista de routes disponibles",
  })
  .check((argv, options) => {
    if (NaN(argv.p)) {
      throw "El puerto debe ser numérico";
    }
    return true;
  }).argv;

module.exports = { argv };
