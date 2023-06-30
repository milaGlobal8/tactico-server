const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// 投稿を作成する
router.post("/", async (req, res) => {
  // ユーザーが存在するか確認
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(403).json("存在しないユーザーです。");
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// プロフィール画像変更用に伴い投稿を更新する
router.put("/:userId", async (req, res) => {
  try {
    // ユーザーが存在しているか確認
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(403).json("存在しないユーザーです。");
    const posts = await Post.find({ userId: req.body.userId });
    if (!posts) {
      return;
    } else {
      posts.map(async (post) => {
        await post.updateOne({
          $set: {
            desc: req.body.desc,
            profilePicture: req.body.profilePicture,
          },
        });
      });
      return res.status(200).json("投稿のユーザー情報更新に成功しました。");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を削除する
router.delete("/:id/:userId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comments = await Comment.find({ postId: post._id });
    // 投稿とコメントを削除
    if (post.userId === req.params.userId) {
      if (comments) {
        comments.map(async (comment) => await comment.deleteOne());
      }
      await post.deleteOne();
      return res.status(200).json("投稿削除に成功しました");
    } else {
      return res
        .status(403)
        .json("他のユーザーの投稿を削除することはできません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// すべての投稿取得
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 特定の投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿検索用のAPI   $options:"i" = 大文字小文字を区別しないオプション
router.get("/search/post/:key", async (req, res) => {
  try {
    let data = await Post.find({
      $or: [
        { postTitle: { $regex: req.params.key, $options: "i" } },
        { leagueName: { $regex: req.params.key, $options: "i" } },
        { goodPlayer: { $regex: req.params.key, $options: "i" } },
        { favoredTeam: { $regex: req.params.key, $options: "i" } },
        { formation: { $regex: req.params.key, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// HOME(TOP)のページで使用するため(個数制限:2つまで)
// 1.プレミア
router.get("/home/premier", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "English Premier League",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 2.ラリーガ
router.get("/home/laliga", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "LaLiga",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 3.ブンデス
router.get("/home/bundes", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "Bundes Liga",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 4.セリエA
router.get("/home/seriea", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "Serie A",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 5.リーグ・アン
router.get("/home/ligue1", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "Ligue 1",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 6.CL
router.get("/home/cl", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "CL",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 7.EL
router.get("/home/el", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "EL",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 8.J-league
router.get("/home/jleague", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "J-league",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 9.National
router.get("/home/national", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "National",
    })
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});

// 個々のページで使用する
// 1.プレミア
router.get("/only/for/premier", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "English Premier League",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 2.ラリーガ
router.get("/only/for/laliga", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "LaLiga",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 3.ブンデス
router.get("/only/for/bundes", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "Bundes Liga",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 4.セリエA
router.get("/only/for/seriea", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "Serie A",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 5.リーグ・アン
router.get("/only/for/ligue1", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "Ligue 1",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 6.CL
router.get("/only/for/cl", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "CL",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 7.EL
router.get("/only/for/el", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "EL",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 8.J-league
router.get("/only/for/jleague", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "J-league",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});
// 9.National
router.get("/only/for/national", async (req, res) => {
  try {
    const posts = await Post.find({
      leagueName: "National",
    }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(403).json(err);
  }
});

// 特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // まだ投稿にいいねが押されていなかったら
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });

      return res.status(200).json("投稿にいいねを押しました");
      // 投稿にすでにいいねが押されていたら
    } else {
      // いいねしているユーザーIDを取り除く
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿からいいねを外しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿の閲覧数
router.put("/:id/view", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      await post.updateOne({
        $inc: {
          views: 1,
        },
      });
    } else {
      return;
    }

    return res.status(200).json("投稿の閲覧数が増えました");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// プロフィール専用のタイムラインの投稿を取得
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 自分がいいねしている投稿をすべて取得する
router.get("/profile/like/:id", async (req, res) => {
  // いいねを押した投稿を取得する
  try {
    const likedPosts = await Post.find({
      likes: req.params.id,
    });

    return res.status(200).json(likedPosts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
