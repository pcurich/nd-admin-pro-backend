const ObjectId = require("mongoose").Types.ObjectId;
const { result200, result400, result500 } = require("../helpers/response");
const { options } = require("../helpers/db-paginate");

const { Category } = require("../models");

const getAll = async (limit, page) => {
  let option = options(limit, page);

  try {
    const data = await Category.paginate({ deleted: false }, option);
    data.itemsList.map((x) => x.toJSON());
    return result200(data, "List of Categories");
  } catch (e) {
    return result500("Error to get categories list", e);
  }
};

const getOne = async (payload) => {
  try {
    const data = await Category.findOne(payload)
      .populate({ path: "createdBy", select: "userName" })
      .populate({ path: "updatedBy", select: "userName" });
    if (data) {
      return result200(data.toJSON(), "Category found");
    } else {
      return result400("Category not found");
    }
  } catch (e) {
    return result500(
      "Error to get category by " +
        Object.keys(payload)[0] +
        " :" +
        Object.values(payload)[0],
      e
    );
  }
};

const postDto = async (payload, userId) => {
  try {
    const categoryBD = await getOne({ name: payload.name });
    console.log("categoryBD :>> ", categoryBD);
    if (categoryBD.data) {
      return result400("Category exist");
    }

    payload.createdB = userId ? new ObjectId(userId) : undefined;
    payload.updatedBy = userId ? new ObjectId(userId) : undefined;

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    const data = new Category(payload);
    await data.save();
    return result200(data.toJSON(), "Category created");
  } catch (e) {
    return result500("Error in create category", e);
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
    const data = await Category.findByIdAndUpdate(new ObjectId(id), payload, {
      new: true,
    });
    return result200(data.toJSON(), "Category updated");
  } catch (e) {
    return result500("Error in update categoryId:" + id, e);
  }
};

const delDto = async (id, userId) => {
  try {
    const data = await Category.findByIdAndUpdate(id, {
      deleted: true,    
      updatedBy: new ObjectId(userId),
    });
    return result200(data.toJSON(), "Delete Category with id:" + id);
  } catch (e) {
    return result500("Error in delete categoryId:" + id, e);
  }
};

module.exports = { getAll, getOne, postDto, putDto, delDto };
