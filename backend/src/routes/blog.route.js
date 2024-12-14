const express = require("express");
const router = express.Router();
const Blog = require("../model/blog.model");
const Comment = require("../model/comment.model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

// Create a new blog post
router.post("/create-post", verifyToken, isAdmin, async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body, author: req.userId });
    await newPost.save();
    res.status(201).send({
      message: "Blog post created successfully",
      data: newPost,
    });
  } catch (err) {
    console.error("Error creating post: ", err);
    res.status(500).send({ message: "Error creating post" });
  }
});
// Get All Blog Posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const { search, category, location } = req.query;
    console.log(search);

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      query = {
        ...query,
        category,
      };
    }

    if (location) {
      query = {
        ...query,
        location,
      };
    }
    const posts = await Blog.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "All blog posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    console.error("Error fetching posts: ", err);
    res.status(500).send({ message: "Error fetching posts" });
  }
});

// get single blog by id
router.get("/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const comment = await Comment.find({ postId: postId }).populate(
      "user",
      "uesrname email"
    );

    res.status(200).send({
      message: "Single blog post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.log("Error fetching single post: ", error);
    res.status(500).send({ message: "Error fetching single post" });
  }
});

// update a blog post
router.patch("/update-post/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    // const { title, content, category } = req.body;
    const updatedPost = await Blog.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    res
      .status(200)
      .send({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send({ message: "Failed to fetch post" });
  }
});

// delete a blog post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Blog.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    // delete all comments related to the deleted post
    await Comment.deleteMany({ postId: postId });

    res.status(200).send({
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send({ message: "Failed to delete post" });
  }
});

// related a blog post
router.get("related/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params.id;
    if (!id) {
      return res.status(400).send({ message: "post id is required" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ message: "post not found" });
    }
    const titleRegex = new RegExp(blog.title.split(" ").join("|"), "i");

    const relatedQuery = {
      _id: { $ne: id },
      title: { $regex: titleRegex },
    };

    const relatedPost = await Blog.find(relatedQuery);
    res.status(200).send({ message: "Related post found!", post: relatedPost });
  } catch {
    console.error("Error fetching related posts:", error);
    res.status(500).send({ message: "Failed to fetch related posts" });
  }
});

module.exports = router;
