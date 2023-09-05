const { response, request } = require("express");
const { paginate } = require("../helpers/db-paginate");
const {
  getAll,
  getOne,
  postDto,
  putDto,
  delDto,
} = require("../service/category.service");
const { interceptor, R200, R404 } = require("../helpers/response");

const getCategories = async (req = request, res = response) => {
  const { limit, page } = paginate(req);
  const result = await getAll(limit, page);
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Categories", result.message)
    );
  }
};

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const payload = { _id: id };
  const result = await getOne(payload);

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Category", result.message)
    );
  }
};

const newCategory = async (req = request, res = response) => {
  const userId = req.user._id;

  const { name, state, picture, color } = req.body;
  const payload = { name, state, picture, color };
  const result = await postDto(payload, userId);

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Category created"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Category", result.message)
    );
  }
};
const updCategory = async (req = request, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const { name, state, color, picture } = req.body;
  const result = await putDto(
    id,
    {
      name,
      state,
      color,
      picture,
    },
    userId
  );
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Category updated"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Category", result.message)
    );
  }
};

const delCategory = async (req = request, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const result = await delDto(id, userId);

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Category deleted"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Category", result.message)
    );
  }
};

module.exports = {
  getCategories,
  getCategory,
  newCategory,
  updCategory,
  delCategory,
};
