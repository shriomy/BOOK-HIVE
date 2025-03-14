const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = userData; // Attach user data to request object
    next();
  });
};

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.id; // Store user ID in request object
    next();
  });
};

const donationverify = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = userData; // Attach user data to request object
    req.isAdmin = userData.isAdmin || false; // Ensure `isAdmin` is available
    next();
  });
};

module.exports = { authMiddleware, authenticateUser, donationverify };
