const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) return res.status(401).send({ message: "Access Denied" });

  const token = bearerToken.slice(7);

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
};
