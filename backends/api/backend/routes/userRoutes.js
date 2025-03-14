const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define the route to get all users
router.get("/user", userController.getAllUsers);

router.get("/user/:id/idcard", userController.getUserIdCard);

module.exports = router;
