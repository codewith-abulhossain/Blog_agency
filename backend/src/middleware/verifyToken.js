const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (!decoded.userId) {
      return res.status(401).send({ message: "user id not found" });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error("Token verification failed", error);
    res.status(401).send({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;
