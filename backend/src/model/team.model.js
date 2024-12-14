const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: String,
  role: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
