const ObjectId = require("mongoose").Types.ObjectId;
const { Company } = require("./../models");
const { result200, result400, result500 } = require("../helpers/response");
const { options } = require("../helpers/db-paginate");

const getAll = async (limit, page) => {
  let option = options(limit, page);

  try {
    const data = await Company.paginate({ deleted: false }, option);
    data.itemsList.map((x) => x.toJSON());
    return result200(data, "List of Companies");
  } catch (e) {
    return result500("Error to get companies list", e);
  }
};

const getOne = async (payload) => {
  try {
    const data = await Company.findOne(payload)
      .populate({ path: "agents", select: "userName _id" })
      .populate({ path: "createdBy", select: "userName" })
      .populate({ path: "updatedBy", select: "userName" });
    if (data) {
      return result200(data.toJSON(), "Company found");
    } else {
      return result400("Company by Id not found");
    }
  } catch (e) {
    return result500("Error to get company by Id:" + payload._id, e);
  }
};

const postDto = async (payload, userId) => {
  console.log("payload :>> ", payload);
  console.log("userId :>> ", userId);

  try {
    payload.createdBy = userId ? new ObjectId(userId) : undefined;
    payload.updatedBy = userId ? new ObjectId(userId) : undefined;

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );
    const data = new Company(payload);
    await data.save();
    return result200(data.toJSON(), "Company Created");
  } catch (e) {
    return result500("Error in create Company", e);
  }
};

const putDto = async (id, payload, userId) => {
  try {
    payload = {
      ...payload,
      updatedBy: new ObjectId(userId),
    };  
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    console.log("payload :>> ", payload);
    const data = await Company.findByIdAndUpdate(new ObjectId(id), payload, {
      new: true,
    });
    return result200(data.toJSON(), "Company updated");
  } catch (e) {
    return result500("Error in update userId:" + id, e);
  }
};

const delDto = async (id, userId) => {
  try {
    const data = await Company.findByIdAndUpdate(id, {
      deleted: true,
      updatedBy: new ObjectId(userId),
    });
    return result200(data.toJSON(), "Delete Company with id:" + id);
  } catch (e) {
    return result500("Error in delete companyId:" + id, e);
  }
};

module.exports = { getAll, getOne, postDto, putDto, delDto };
