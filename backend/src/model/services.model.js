const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  photo: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
