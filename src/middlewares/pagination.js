module.exports = function (model) {
  return async function (req, res, next) {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);

    if (page <= 0 || limit < 0) {
      res.status(400).json({ message: "query params invalid" });
    }

    const startIndex = (page - 1) * limit;
    const count = await model.countDocuments().exec();
    const totalPage =
      limit < count ? Math.round(count / (limit === 0 ? 1 : limit)) : 1;

    if (limit > count && page > 1) {
      res.status(400).json({ message: "page out of range" });
    }

    try {
      const data = await model.find().limit(limit).skip(startIndex).exec();
      res.result = {
        data,
        pagination: {
          page,
          limit,
          totalPage,
        },
      };
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
