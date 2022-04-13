require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

const app = express();
const { PORT = 5000, MONGODB_URI } = process.env;
const PostModel = mongoose.model(
  "Post",
  new mongoose.Schema(
    {
      title: String,
      content: String,
      date: Date,
    },
    { timestamps: true }
  )
);
const CommentModel = mongoose.model(
  "Comment",
  new mongoose.Schema(
    {
      name: String,
      comment: String,
      date: { type: Date, default: new Date() },
      post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    },
    { timestamps: true }
  )
);

app.use([
  cors(),
  express.json(),
]);
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("/api", (req, res) => res.status(200).json({ msg: "Hello from API" }));
app.get("/api/posts", async (req, res) => {
  try {
    const data = await PostModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      data,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
});
app.post("/api/posts", async (req, res) => {
  try {
    const data = await PostModel.create(req.body);
    return res.status(201).json({
      data,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
});
app.get("/api/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const data = await PostModel.findById(postId);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
});
app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const data = await CommentModel.find({ post: postId, parent: { $eq: null } }).sort({ createdAt: -1 });
    return res.status(200).json({
      data,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
});
app.post("/api/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({
      msg: "Post not found!",
    });
    const data = await CommentModel.create(req.body);
    return res.status(201).json({
      data,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
});
app.get("/api/posts/:postId/comments/:commentId/comments", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const data = await CommentModel.find({ post: postId, parent: commentId }).sort({ createdAt: -1 });
    return res.status(200).json({
      data,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
})

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Database Connected!`);
  return app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
}).catch(console.error);