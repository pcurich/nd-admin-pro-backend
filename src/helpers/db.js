const paginate = (req) => {
  const limit = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 10;

  return { limit, page };
};

const options = (limit, page) => {
  return {
    sort: { name: -1 },
    populate: [
      { path: "createdBy", select: "userName", strictPopulate: false },
      { path: "updatedBy", select: "userName", strictPopulate: false },
    ],
    lean: false,
    page: page * 1,
    limit: limit * 1,
  };
};

module.exports.paginate = paginate;
module.exports.options = options;
