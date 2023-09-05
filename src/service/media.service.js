const { User } = require("../models");
const { result200, result400, result500 } = require("../helpers/response");

const uploadImagen = async (email, password) => {
  try {
    const userFound = await User.findOne({ email, deleted: false }).populate(
      "rolId",
      "_id name state"
    );
    if (!userFound) return result400("User Not Found");

    const matchPassword = await userFound.matchPassword(password);
    if (!matchPassword) return result400("Invalid Password");

    return result200(userFound.toJSON(), "OK");
  } catch (err) {
    return result500(JSON.stringify(err));
  }
};

module.exports = { uploadImagen };
