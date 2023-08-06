var morgan = require("morgan");
var path = require("path");
const rfs = require("rotating-file-stream");
const config = {
  size: "10M", // rotate every 10 MegaBytes written
  interval: "1d", // rotate daily
  compress: "gzip", // compress rotated files
  path: path.join(__dirname, "./../../log"),
};
const stream = rfs.createStream("file.log", config);

module.exports = morgan(process.env.NODE_ENV, {
  // skip: function (req, res) { return res.statusCode < 400 },
  stream,
});
