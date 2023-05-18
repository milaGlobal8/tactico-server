const router = require("express").Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

// コメントを作成する
router.post("/", async (req, res) => {
  // ユーザーが存在するか確認
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(403).json("存在しないユーザーです。");
  // 投稿が存在するか確認
  const post = await Post.findById(req.body.postId);
  if (!post) return res.status(403).json("存在しない投稿です。");
  // 新しいコメントを作成
  const newComment = new Comment(req.body);
  try {
    // コメントを保存
    const savedComment = await newComment.save();

    // 投稿のcommentsにコメントの_idを追加
    await post.updateOne({
      $push: {
        comments: savedComment._id,
      },
    });

    return res.status(200).json("コメントの投稿に成功しました");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// コメントを更新する
router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId === req.body.userId) {
      await comment.updateOne({
        $set: req.body,
      });

      return res.status(200).json("コメント編集に成功しました");
    } else {
      return res
        .status(403)
        .json("他のユーザーのコメントを編集することはできません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// コメントを削除する
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId === req.body.userId) {
      await comment.deleteOne();

      return res.status(200).json("コメント削除に成功しました");
    } else {
      return res
        .status(403)
        .json("他のユーザーのコメントを削除することはできません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 特定の投稿にコメントされたコメントを見つける
router.get("/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 特定のコメントにいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    // まだコメントにいいねが押されていなかったら
    if (!comment.likes.includes(req.body.userId)) {
      await comment.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });

      return res.status(200).json("コメントにいいねを押しました");
    } else {
      await comment.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("コメントからいいねを外しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
