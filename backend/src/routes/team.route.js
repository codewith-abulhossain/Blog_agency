const express = require("express");
const router = express.Router();
const Team = require("../model/team.model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

//  create a new Team membership

router.post("/add-team", verifyToken, isAdmin, async (req, res) => {
  try {
    const newMember = new Team({ ...req.body, author: req.userId });
    await newMember.save();
    res.status(201).send({
      message: "Blog post created successfully",
      data: newMember,
    });
  } catch (err) {
    console.error("Error creating post: ", err);
    res.status(500).send({ message: "Error creating post" });
  }
});

//  get a all team members
router.get("/", verifyToken, async (req, res) => {
  try {
    const teamMembers = await Team.find();
    res.status(200).send({
      message: "All team members fetched successfully",
      data: teamMembers,
    });
  } catch (error) {}
});

// get a single team member
router.get("/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const memberId = req.params.id;
    const member = await Team.findById(memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found" });
    }
    res.status(200).send({
      message: "Single team member fetched successfully",
      data: member,
    });
  } catch {
    console.log("Error Fetching single member");
    res.status(500).send({ message: "Error fetching member" });
  }
});

// update a team member

router.patch("/update-member/:id", verifyToken, async (req, res) => {
  try {
    const memberId = req.params.id;
    const updatedMember = await Team.findByIdAndUpdate(
      memberId,
      { ...req.body },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).send({ message: "Member not found" });
    }
    res.status(200).send({
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    console.log("Error updating member");
    res.status(500).send({ message: "Error updating member" });
  }
});

// delete a team member

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const memberId = req.params.id;
    const deletedMember = await Team.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return res.status(404).send({ message: "Member not found" });
    }
    res.status(200).send({
      message: "Member deleted successfully",
      data: deletedMember,
    });
  } catch (error) {
    console.log("Error deleting member");
    res.status(500).send({ message: "Error deleting member" });
  }
});

module.exports = router;
