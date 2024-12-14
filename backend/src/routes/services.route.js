const express = require("express");
const router = express.Router();
const Service = require("../model/services.model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

// create a new service
router.post("/createService", verifyToken, isAdmin, async (req, res) => {
  try {
    // console.log(req.body);
    const newService = new Service({ ...req.body, author: req.userId });
    await newService.save();
    res.status(201).send({
      message: "Service created successfully",
      Service: newService,
    });
  } catch (error) {
    console.error("Error creating service: ", error);
    res.status(500).send({ message: "Error creating service" });
  }
});

// Get all services
router.get("/", verifyToken, async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).send({
      message: "All services fetched successfully",
      data: services,
    });
  } catch (error) {
    console.error("Error getting services: ", error);
    res.status(500).send({ message: "Error getting services" });
  }
});

// get a single service by id
router.get("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send({
      message: "Service fetched successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service: ", error);
    res.status(500).send({ message: "Error fetching service" });
  }
});

// update a service
router.patch("/update-post/:id", verifyToken, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { ...req.body },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send({
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service: ", error);
    res.status(500).send({ message: "Error updating service" });
  }
});

// delete a service
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send({
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error) {
    console.error("Error deleting service: ", error);
    res.status(500).send({ message: "Error deleting service" });
  }
});

module.exports = router;
