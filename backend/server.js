import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import commentRouter from "./routes/comment";
import morgan from "morgan";
import { listComments, createComment } from "./controllers/comments";

//Connecting to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/react-native-comments", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//Initialize http server
const app = express();
const http = require("http").createServer(app);
var io = require("socket.io").listen(http);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("tiny"));

//Router
app.use("/auth", authRouter);
app.use("/comments", commentRouter);
app.get("/", function(req, res) {
  res.send("<h1>Hello world</h1>");
});

//Socket
io.on("connection", socket => {
  console.log("a user connected");
  socket.on("add comment", comment => {
    console.log(comment);
    io.emit("add comment", comment);
  });
  socket.on("like", data => {
    io.emit(`${data.id}like`, data.message);
  });
});

const server = http.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
