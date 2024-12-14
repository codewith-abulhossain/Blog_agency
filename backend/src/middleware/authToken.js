const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    return token;
  } catch (error) {
    console.error("Error generating JWT token", error);
    throw error;
  }
};

module.exports = generateToken;
