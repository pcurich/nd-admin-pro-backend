const { User } = require("../models");
const { result200, result400, result500 } = require("../helpers/response");

const signInUser = async (email, password) => {
  try {
    const userFound = await User.findOne({ email, deleted: false }).exec();
    if (!userFound) return result400("User Not Found");

    const matchPassword = await userFound.matchPassword(password);
    if (!matchPassword) return result400("Invalid Password");

    return result200(userFound.toJSON(), "OK");
  } catch (err) {
    return result500(JSON.stringify(err));
  }
};

const createUser = async (
  userName,
  firstName,
  lastName,
  dni,
  email,
  password,
  picture,
  state
) => {
  try {
    const data = new User({
      userName,
      firstName,
      lastName,
      dni,
      email,
      password,
      picture,
      state,
    });
    data.password = await data.encryptPassword(password);
    await data.save();
    return result200(data.toJSON(), "User Created");
  } catch (err) {
    if (err.code == 11000) {
      return result400("duplicate key: " + err.keyValue);
    } else {
      return result500("Error generic with data base");
    }
  }
};

const findUserByEmail = async (email) => {
  try {
    const userFound = await User.findOne(
      { email, deleted: false },
      { password: 0 }
    );
    if (!userFound) return result400("User Not Found");

    return result200(userFound.toJSON(), "User Found");
  } catch (e) {
    return result500("Error generic with data base = " + e.message);
  }
};

const findUserById = async (id) => {
  try {
    const userFound = await User.findOne(
      { _id: id, deleted: false },
      { password: 0 }
    );
    if (!userFound) return result400("User Not Found");

    return result200(userFound.toJSON(), "User Found");
  } catch (e) {
    return result500("Error generic with data base = " + e.message);
  }
};

const updateUser = async (id, payload) => {
  try {
    const data = await User.findByIdAndUpdate(id, payload, { new: true });
    return result200(data.toJSON(), "User Updated");
  } catch (e) {
    return result500("Error generic with data base = " + e.message);
  }
};

const changePasswordUser = async (email, newPassword) => {
  try {
    const _tmp = new User();
    const data = await User.findOneAndUpdate(
      { email },
      { password: await _tmp.encryptPassword(newPassword) },
      { new: true }
    );
    return result200(data.toJSON(), "Password changed");
  } catch (e) {
    return result500("Error to save the new password by email: " + e.message);
  }
};

const renewTokenUser = async (id) => {
  try {
    const userFound = await User.findOne(
      { _id: id, deleted: false },
      { password: 0 }
    );
    if (!userFound) return result400("User Not Found");
    return result200(userFound.toJSON(), "User Found");
  } catch (e) {
    return result500("Error to get a new token: " + e.message);
  }
};

module.exports = {
  signInUser,
  createUser,
  updateUser,
  findUserByEmail,
  findUserById,
  changePasswordUser,
  renewTokenUser,
};
