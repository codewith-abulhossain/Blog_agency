const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

// parse options
app.use(express.json());
app.use(cors());

// all routes
// blog routes
const blogRoutes = require("./src/routes/blog.route");
// team routes
const teamRoutes = require("./src/routes/team.route");
// services routes
const servicesRoutes = require("./src/routes/services.route");
// common routes
const commonRoutes = require("./src/routes/comment.route");
// user routes
const userRoutes = require("./src/routes/auth.user.route");

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/service", servicesRoutes);
app.use("/api/comment", commonRoutes);

// connect mongodb to server
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

  app.get("/", (req, res) => {
    res.send("Server is listening on Port ");
  });
}
// OhUBgMYr2032afpP
// abulhossain291555
main()
  .then(() => console.log("Mongodb Connected successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
