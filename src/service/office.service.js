const ObjectId = require("mongoose").Types.ObjectId;
const { Office } = require("./../models");
const { result200, result400, result500 } = require("../helpers/response");
const { options } = require("../helpers/db-paginate");

const getAll = async (limit, page) => {
  let option = options(limit, page);

  try {
    const data = await Office.paginate({ deleted: false }, option);
    data.itemsList.map((x) => x.toJSON());
    return result200(data, "List of Offices");
  } catch (e) {
    return result500("Error to get offices list", e);
  }
};

const getOne = async (payload) => {
  try {
    const data = await Office.findOne(payload)
      .populate({
        path: "companyId",
        select: "name documentType documentValue _id",
      })
      .populate({ path: "workers", select: "userName  _id" })
      .populate({ path: "createdBy", select: "userName" })
      .populate({ path: "updatedBy", select: "userName" });
    if (data) {
      return result200(data.toJSON(), "Office found");
    } else {
      return result400("Office by Id not found");
    }
  } catch (e) {
    return result500("Error to get office by Id:" + payload._id, e);
  }
};

const postDto = async (payload, userId) => {
  try {
    payload.createdBy = userId ? new ObjectId(userId) : undefined;
    payload.updatedBy = userId ? new ObjectId(userId) : undefined;

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );
    const data = new Office(payload);
    await data.save();
    return result200(data.toJSON(), "Office Created");
  } catch (e) {
    return result500("Error in create Office", e);
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

    const data = await Office.findByIdAndUpdate(new ObjectId(id), payload, {
      new: true,
    });
    return result200(data.toJSON(), "Office updated");
  } catch (e) {
    return result500("Error in update userId:" + id, e);
  }
};

const delDto = async (id, userId) => {
  try {
    const data = await Office.findByIdAndUpdate(id, {
      deleted: true,
      updatedBy: new ObjectId(userId),
    });
    return result200(data.toJSON(), "Delete Office with id:" + id);
  } catch (e) {
    return result500("Error in delete officeId:" + id, e);
  }
};

module.exports = { getAll, getOne, postDto, putDto, delDto };
