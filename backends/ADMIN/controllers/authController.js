const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const jwtSecret = require("../config/jwtConfig").jwtSecret;
const bcryptSalt = bcrypt.genSaltSync(10);

// Register new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await Admin.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await Admin.findOne({ email });

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            return res.status(500).json({ message: "JWT error", error: err });
          }
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// Get profile of the logged-in user
exports.profile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      try {
        const { name, email, _id } = await Admin.findById(userData.id);
        if (!name || !email || !_id) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ name, email, _id });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  } else {
    res.json(null);
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie("token", "").json(true);
};
