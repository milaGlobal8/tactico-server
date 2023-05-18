const express = require("express");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const mongoose = require("mongoose");
// envファイル変更後はサーバーを再起動するのを忘れない
require("dotenv").config();
const port = process.env.PORT || 5001;

// データベース接続
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: false,
  })
  .then(() => {
    console.log("DBと接続中・・・");
  })
  .catch((err) => {
    console.log("MongoDBエラー");
    console.log(err);
  });

// ミドルウェア
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.listen(port, () => console.log(`サーバー起動中 - ポート番号:${port}`));
