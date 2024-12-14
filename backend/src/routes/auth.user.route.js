const express = require("express");
const User = require("../model/user.model");
const generateToken = require("../middleware/authToken");
const router = express.Router();

// register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, password, username });
    // console.log(user);
    await user.save();
    res
      .status(201)
      .send({ message: "User registered successfully", user: user });
  } catch (error) {
    console.error(" Failed to register", error);
    res.status(500).send({ message: "Error registering user" });
  }
});

// login an existing user
router.post("/login", async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // generate token
    const token = await generateToken(user._id);
    res.cookie("token", token),
      {
        httpOnly: true,
        secure: true,
        sameSite: true,
      };

    res.status(200).send({
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).send({ message: "Error logging in user" });
  }
});

//  login out user
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "User logged out successfully" }); // clear cookie here as well as in middleware/authToken.js
  } catch (error) {
    console.error("Failed to logout", error);
    res.status(500).send({ message: "Error logging out user" });
  }
});

//  get all users

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role");
    res.status(200).send({ message: "Users found successfully", users });
  } catch (error) {
    console.error("Failed to get users", error);
    res.status(500).json({ message: "Error getting users" });
  }
});

// delete a users
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Failed to delete user", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// update a user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Failed to update user", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

module.exports = router;
