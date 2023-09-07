const { response, request } = require("express");
const { paginate } = require("../helpers/db-paginate");
const {
  getAll,
  getOne,
  postDto,
  putDto,
  delDto,
} = require("../service/company.service");

const {
  postDto: postAgent,
  getOne: findAgent,
} = require("../service/user.service");

const { interceptor, R200, R404 } = require("../helpers/response");

const getCompanies = async (req = request, res = response) => {
  const { limit, page } = paginate(req);
  const result = await getAll(limit, page);
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Companies", result.message)
    );
  }
};

const getCompany = async (req = request, res = response) => {
  const { id } = req.params;
  const payload = { _id: id };
  const result = await getOne(payload);
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Company", result.message)
    );
  }
};

const newCompany = async (req = request, res = response) => {
  const userId = req.user._id;

  const { name, documentType, documentValue, logo } = req.body;

  const result = await postDto(
    { name, documentType, documentValue, logo },
    userId
  );

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Company created"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Company", result.message)
    );
  }
};

const addAgent = async (req = request, res = response) => {
  const userId = req.user._id;
  const { companyId, user } = req.body;

  let userBD = { data: { id: user.id } };

  if (!user.id) {
    userBD = await postAgent(user, userId);
  }

  let companyDB = await getOne({ _id: companyId });
  let agents = companyDB.data.agents.map((x) => x.id);
  agents.push(userBD.data.id);
  companyDB.data.agents = Array.from(new Set(agents));
  delete companyDB.data.createdBy;

  let result = await putDto(companyId, companyDB.data, userId);
  result = await getOne({ _id: companyId });

  if (result?.status && result?.data) {
    return interceptor(res, result).json(
      R200(result.data, "Company Agent added")
    );
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Company", result.message)
    );
  }
};

const rmAgent = async (req = request, res = response) => {
  const userId = req.user._id;
  const { companyId, user } = req.body;

  let userBD = { data: { id: user.id } };

  let companyDB = await getOne({ _id: companyId });
  let agents = companyDB.data.agents
    .filter((x) => x.id != userBD.data.id)
    .map((x) => x.id);
  companyDB.data.agents = Array.from(new Set(agents));
  delete companyDB.data.createdBy;

  let result = await putDto(companyId, companyDB.data, userId);
  result = await getOne({ _id: companyId });

  if (result?.status && result?.data) {
    return interceptor(res, result).json(
      R200(result.data, "Company Agent removed")
    );
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Company", result.message)
    );
  }
};

const addOffice = async (req = request, res = response) => {};

const updCompany = async (req = request, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const { name, documentType, documentValue, logo } = req.body;

  const result = await putDto(
    id,
    { name, documentType, documentValue, logo },
    userId
  );

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Company updated"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Company", result.message)
    );
  }
};

const delCompany = async (req = request, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const result = await delDto(id, userId);

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Company deleted"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Company", result.message)
    );
  }
};

module.exports = {
  getCompanies,
  getCompany,
  newCompany,
  addAgent,
  rmAgent,
  addOffice,
  updCompany,
  delCompany,
};
