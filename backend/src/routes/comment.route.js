const express = require("express");
const Comment = require("../model/comment.model");
const router = express.Router();

// create a comment
router.post("/post-comment", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res
      .status(200)
      .send({ message: "Comment created successfully", comment: newComment });
  } catch (err) {
    console.error("Error creating comment: ", err);
    res.status(500).send({ message: err.message, data: err.data });
  }
});

// get all comments

router.get("/all-comments", async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments({});
    res
      .status(200)
      .send({ message: "total comments found", comments: totalComments });
  } catch (err) {
    console.error("Error getting comments: ", err);
    res.status(500).send({ message: err.message, data: err.data });
  }
});

module.exports = router;
