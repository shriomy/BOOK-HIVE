const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwtConfig").jwtSecret;

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, (err, userData) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.userData = userData;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
