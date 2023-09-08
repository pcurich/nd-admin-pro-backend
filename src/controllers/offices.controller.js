const { response, request } = require("express");
const { paginate } = require("../helpers/db-paginate");
const {
  getAll,
  getOne,
  postDto,
  putDto,
  delDto,
} = require("../service/office.service");

const {
  postDto: postWorker,
  getOne: findWorker,
} = require("../service/user.service");

const { interceptor, R200, R404 } = require("../helpers/response");

const getOffices = async (req = request, res = response) => {
  const { limit, page } = paginate(req);
  const result = await getAll(limit, page);
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Offices", result.message)
    );
  }
};

const getOffice = async (req = request, res = response) => {
  const { id } = req.params;
  const payload = { _id: id };
  const result = await getOne(payload);
  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "OK"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Office", result.message)
    );
  }
};

const newOffice = async (req = request, res = response) => {
  const userId = req.user._id;

  const { name, companyId, address, googleMaps, latitude, longitude } =
    req.body;

  const result = await postDto(
    { name, companyId, address, googleMaps, latitude, longitude },
    userId
  );

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Office created"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Office", result.message)
    );
  }
};

const addWorker = async (req = request, res = response) => {
  const userId = req.user._id;
  const { officeId, user } = req.body;

  let userBD = { data: { id: user.id } };

  if (!user.id) {
    userBD = await postWorker(user, userId);
  }

  let officeDB = await getOne({ _id: officeId });
  let workers = officeDB.data.workers.map((x) => x.id);
  workers.push(userBD.data.id);
  workers.data.workers = Array.from(new Set(workers));
  delete officeDB.data.createdBy;

  let result = await putDto(officeId, officeDB.data, userId);
  result = await getOne({ _id: officeId });

  if (result?.status && result?.data) {
    return interceptor(res, result).json(
      R200(result.data, "Office worker added")
    );
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Office", result.message)
    );
  }
};

const rmWorker = async (req = request, res = response) => {
  const userId = req.user._id;
  const { officeId, user } = req.body;

  let userBD = { data: { id: user.id } };

  let officeDB = await getOne({ _id: officeId });
  let workers = officeDB.data.workers
    .filter((x) => x.id != userBD.data.id)
    .map((x) => x.id);
  officeDB.data.workers = Array.from(new Set(workers));
  delete officeDB.data.createdBy;

  let result = await putDto(officeId, officeDB.data, userId);
  if (result?.status && result?.data) {
    result = await getOne({ _id: officeId });

    if (result?.status && result?.data) {
      return interceptor(res, result).json(
        R200(result.data, "Office Worker removed")
      );
    } else {
      return interceptor(res, result).json(
        R404(result.code, "Office", result.message)
      );
    }
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Office", result.message)
    );
  }
};

const updOffice = async (req = request, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const { name, companyId, address, googleMaps, latitude, longitude } =
    req.body;

  const result = await putDto(
    id,
    { name, companyId, address, googleMaps, latitude, longitude },
    userId
  );

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Office updated"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Office", result.message)
    );
  }
};

const delOffice = async (req = request, res = response) => {
  const id = req.params.id;
  const userId = req.user._id;
  const result = await delDto(id, userId);

  if (result?.status && result?.data) {
    return interceptor(res, result).json(R200(result.data, "Office deleted"));
  } else {
    return interceptor(res, result).json(
      R404(result.code, "Office", result.message)
    );
  }
};

module.exports = {
  getOffices,
  getOffice,
  newOffice,
  addWorker,
  rmWorker,
  updOffice,
  delOffice,
};
