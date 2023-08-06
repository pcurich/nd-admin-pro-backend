const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

// Set The Storage Engine
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("pcurich-destination", req.body);
    cb(null, "uploads/");
    // cb(null, __dirname + '/uploads/');
  },
  filename: (req, file, cb) => {
    console.log("pcurich-filename", req.body);
    const extension = file.mimetype.split("/")[1];
    cb(null, `${shortid.generate()}.${extension}`);
  },
});

// Check File Type
const checkFileType = (file, cb) => {
  // console.log("pcurich-checkFileType", file)
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const configurationMulter = {
  storage: fileStorage,
  limits: {
    fileSize: 2 * 10000000,
  },
  fileFilter(req, file, cb) {
    console.log("pcurich-fileFilter", file);
    checkFileType(file, cb);
  },
};

//pasar la configuracion y el campo
module.exports = multer(configurationMulter).single("file");
