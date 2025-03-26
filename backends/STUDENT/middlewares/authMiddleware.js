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

const deleteauth = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object
    req.user = decoded;

    // Check if the logged-in user is trying to delete their own account
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this account" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

const authMiddlewareborrowed = (req, res, next) => {
  // Check both cookie and Authorization header
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
      details: "Please log in to access this resource",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        details: "Please log in again",
      });
    }
    return res.status(401).json({
      message: "Invalid token",
      details: "Authentication failed",
    });
  }
};

module.exports = { authMiddleware };

module.exports = {
  authMiddleware,
  authenticateUser,
  donationverify,
  deleteauth,
  authMiddlewareborrowed,
};
