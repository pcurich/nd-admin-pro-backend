const paginate = (req) => {
  const limit = Number(req.query.limit) || 3;
  const page = Number(req.query.page) || 0;

  return { limit, page };
};

const options = (limit, page) => {
  const myCustomLabels = {
    totalDocs: "itemCount",
    docs: "itemsList",
    limit: "perPage",
    page: "currentPage",
    nextPage: "next",
    prevPage: "prev",
    totalPages: "pageCount",
    pagingCounter: "slNo",
    meta: "paginator",
  };
  return {
    sort: { name: -1 },
    populate: [
      { path: "createdBy", select: "userName", strictPopulate: false },
      { path: "updatedBy", select: "userName", strictPopulate: false },
    ],
    lean: false,
    page: page * 1,
    limit: limit * 1,
    customLabels: myCustomLabels,
  };
};

module.exports = { paginate, options };
