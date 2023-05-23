const router = require("express").Router();
const User = require("../models/User");

// 新規登録
router.post("/register", async (req, res) => {
  try {
    // ユーザーネームが重複するか確認
    const sameNameUser = await User.findOne({ username: req.body.username });
    // パスワードが重複するか確認
    const samePasswordUser = await User.findOne({
      password: req.body.password,
    });
    // 重複したら
    if (sameNameUser) {
      return res.status(401).json("すでに存在しているユーザーネームです");
    } else if (samePasswordUser) {
      return res.status(401).json("すでに存在しているパスワードです");
    }

    const newUser = await new User({
      username: req.body.username,
      password: req.body.password,
      secretQuestion: req.body.secretQuestion,
      secretAnswer: req.body.secretAnswer,
    });

    const user = await newUser.save();
    const { password, secretQuestion, secretAnswer, updatedAt, ...other } =
      user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) return res.status(401).json("ユーザーネームが違います");

    const validPassword = req.body.password === user.password;
    if (!validPassword) return res.status(401).json("パスワードが違います");

    // isAdmin変更
    if (user) {
      await User.updateOne(
        { username: user.username },
        { $set: { isAdmin: true } }
      );

      const updatedUser = await User.findOne({ username: req.body.username });
      const { password, secretQuestion, secretAnswer, updatedAt, ...other } =
        updatedUser._doc;

      return res.status(200).json(other);
    } else {
      return res.status(404).json("ユーザーが見つかりません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ログアウト
router.post("/logout", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body._id,
      username: req.body.username,
    });
    if (!user) return res.status(401).json("ユーザー情報が違います");

    // isAdmin変更
    if (user) {
      await User.updateOne(
        { username: user.username },
        { $set: { isAdmin: false } }
      );

      return res.status(200).json("ログアウト成功");
    } else {
      return res.status(404).json("ユーザーが見つかりません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// パスワード再設定
router.put("/reset/password", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // ユーザーネームの確認
    if (!user) return res.status(401).json("ユーザーネームが違います");
    // 秘密の質問の確認
    if (user.secretQuestion !== req.body.secretQuestion)
      return res.status(401).json("秘密の質問が違います");
    // 秘密の質問の答えの確認
    if (user.secretAnswer !== req.body.secretAnswer)
      return res.status(401).json("秘密の質問の答えが違います");
    // すべて合っていたら
    if (
      user.username === req.body.username &&
      user.secretQuestion === req.body.secretQuestion &&
      user.secretAnswer === req.body.secretAnswer
    ) {
      // 再設定されたパスワードが他のパスワードと重複しているか確認
      const samePassword = await User.findOne({ password: req.body.password });
      if (samePassword)
        return res.status(401).json("すでに存在しているパスワードです");
      // 重複していなかったら
      await user.updateOne({
        $set: req.body,
      });
      return res.status(200).json("パスワード再設定に成功しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// サーバー起動
router.get("/start/server", (req, res) => {
  try {
    return res.status(200).json("サーバーが起動しました");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
