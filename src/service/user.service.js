const ObjectId = require("mongoose").Types.ObjectId;
const { User } = require("./../models");
const { result200, result400, result500 } = require("../helpers/response");
const { options } = require("../helpers/db-paginate");

const getAll = async (limit, page) => {
  let option = options(limit, page);

  try {
    const data = await User.paginate({ deleted: false }, option);
    console.log("PCURICH DATA =", data);
    data.itemsList.map((x) => x.toJSON());
    return result200(data, "List of Users");
  } catch (e) {
    return result500("Error to get users list", e);
  }
};

const getOne = async (payload) => {
  try {
    const data = await User.findOne(payload)
      .populate({ path: "createdBy", select: "userName" })
      .populate({ path: "updatedBy", select: "userName" });
    if (data) {
      return result200(data.toJSON(), "User found");
    } else {
      return result400("User by Id not found");
    }
  } catch (e) {
    return result500("Error to get user by Id:" + id, e);
  }
};

const postDto = async (payload, userId) => {
  try {
    payload.createdBy = userId ? new ObjectId(userId) : undefined;
    payload.updatedBy = userId ? new ObjectId(userId) : undefined;

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );
    const data = new User(payload);
    data.password = await data.encryptPassword(payload.password);
    await data.save();
    return result200(data.toJSON(), "User Created");
  } catch (e) {
    return result500("Error in create User", e);
  }
};

const putDto = async (id, payload, userId) => {
  try {
    payload = {
      ...payload,
      updatedBy: userId,
    };
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );
    const data = await User.findByIdAndUpdate(new ObjectId(id), payload, {
      new: true,
    });
    return result200(data.toJSON(), "User updated");
  } catch (e) {
    return result500("Error in update userId:" + id, e);
  }
};

const delDto = async (id, userId) => {
  try {
    const data = await User.findByIdAndUpdate(id, {
      deleted: true,
      updatedBy: new ObjectId(userId),
    });
    return result200(data.toJSON(), "Delete User with id:" + id);
  } catch (e) {
    return result500("Error in delete userId:" + id, e);
  }
};

module.exports = { getAll, getOne, postDto, putDto, delDto };
