const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();
require("./../db/connection");
const userRouter = require("./routes/userRoutes");
const goalRouter = require("./routes/goalRoutes");
const contactRouter = require("./routes/contactRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const likeRouter = require("./routes/likeRoutes");
const incidentRouter = require("./routes/incidentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use((req, res, next) => {
  console.log("HTTP METHOD - " + req.method + ", URL - " + req.url);
  next();
});

app.use("/users", userRouter);
app.use("/goals", goalRouter);
app.use("/contact", contactRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/like", likeRouter);
app.use("/incident", incidentRouter);

app.listen(3001, () => {
  console.log("server listening on port 3001");
});
