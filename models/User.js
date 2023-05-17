const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 40,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 50,
      unique: true,
    },
    secretQuestion: {
      type: String,
      required: true,
    },
    secretAnswer: {
      type: String,
      required: true,
      max: 50,
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
      default: false,
    },
  },

  //   データを格納した日付と時間を記録
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
