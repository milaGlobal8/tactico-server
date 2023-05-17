const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    // 投稿者の情報
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    // 自己紹介文
    desc: {
      type: String,
      max: 70,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
    },
    // ここから投稿の情報
    likes: {
      // 誰がいいねしたかといいね数を格納するために配列型
      type: Array,
      default: [],
    },
    comments: {
      // 誰がコメントしたかを判別する(commentId)とコメント数(配列のインデックス)を格納するために配列型
      type: Array,
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    leagueName: {
      type: String,
      required: true,
    },
    postTitle: {
      type: String,
      required: true,
    },
    favoredTeam: {
      type: String,
      required: true,
    },
    goodPlayer: {
      type: String,
      max: 200,
      required: true,
    },
    // 攻撃戦術
    offense: {
      type: String,
      max: 400,
      required: true,
    },
    // 守備戦術
    defense: {
      type: String,
      max: 400,
      required: true,
    },
    formation: {
      type: String,
      required: true,
    },
    // 各playerの名前を格納する変数
    player1: {
      type: String,
      max: 200,
      required: true,
    },
    player2: {
      type: String,
      max: 200,
      required: true,
    },
    player3: {
      type: String,
      max: 200,
      required: true,
    },
    player4: {
      type: String,
      max: 200,
      required: true,
    },
    player5: {
      type: String,
      max: 200,
      required: true,
    },
    player6: {
      type: String,
      max: 200,
      required: true,
    },
    player7: {
      type: String,
      max: 200,
      required: true,
    },
    player8: {
      type: String,
      max: 200,
      required: true,
    },
    player9: {
      type: String,
      max: 200,
      required: true,
    },
    player10: {
      type: String,
      max: 200,
      required: true,
    },
    player11: {
      type: String,
      max: 200,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
