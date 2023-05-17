const router = require("express").Router();
const User = require("../models/User");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, getFileStream, deleteFile } = require("../s3");

// ※ユーザー情報の作成はauth.jsに記載

// ユーザー情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        // スキーマの中のすべてのパラメータを指す$set
        $set: req.body,
      });

      const updatedUser = await User.findById(req.body.userId);
      const { password, secretQuestion, secretAnswer, updatedAt, ...other } =
        await updatedUser._doc;
      return res.status(200).json(other);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("自分のアカウントのみユーザー情報を更新できます");
  }
});

// ユーザー情報の取得
// 特定のユーザー取得
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, secretQuestion, secretAnswer, updatedAt, ...other } =
      user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// クエリでユーザーを取得
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    // パスワードといつ更新されたかの情報は秘匿にするため抜き出す
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザー検索用のAPI   $options:"i" = 大文字小文字を区別しないオプション
router.get("/search/user/:key", async (req, res) => {
  try {
    let data = await User.find({
      $or: [{ username: { $regex: req.params.key, $options: "i" } }],
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // targetUser=相手, currentUser=自分
      const targetUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに自分がいなかったらフォローする
      if (!targetUser.followers.includes(req.body.userId)) {
        await targetUser.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });

        const updatedUser = await User.findById(req.body.userId);
        const { password, updatedAt, ...other } = updatedUser._doc;

        return res.status(200).json(other);
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォローしています");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(500).json("自分自身でフォローすることはできません");
  }
});

// ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const targetUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに存在したらフォローを外せる
      if (targetUser.followers.includes(req.body.userId)) {
        // 相手のフォロワー配列から自分を削除
        await targetUser.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        // 自分のフォロー配列から相手を削除
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });

        const updatedUser = await User.findById(req.body.userId);
        const { password, updatedAt, ...other } = updatedUser._doc;

        return res.status(200).json(other);
      }
    } catch (err) {
      return res.status(403).json("このユーザーはフォロー解除できません");
    }
  } else {
    return res.status(500).json("自分自身でフォロー解除することはできません");
  }
});

// ユーザーのプロフィール画像を取得する
router.get("/profilePicture/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザーのプロフィール画像を削除する
router.delete("/profilePicture/delete/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const result = await deleteFile(key);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ユーザーのプロフィール画像をセットする
router.post(
  "/profilePicture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const file = req.file;
      const result = await uploadFile(file);
      await unlinkFile(file.path);
      const description = req.body.description;
      res.send({ imagePath: result.Key });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
