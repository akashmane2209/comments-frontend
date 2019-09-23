import Comment from "../models/comment";

//User relation for populate
const userRelation = {
  path: "user",
  select: ["name", "avatar"],
  model: "User"
};

//List existing comments
export const listComments = async (req, res, next) => {
  //Get all comments and populate User Models
  const comments = await Comment.find({ type: "comment" })
    .sort({ created: -1 })
    .populate(userRelation)
    .exec();

  res.status(200).json({ comments });
};

//Create new comment
export const createComment = async (req, res, next) => {
  const { user_id, content } = req.body;
  //Save comment
  const comment = await new Comment({
    user: user_id,
    content: content,
    type: "comment"
  }).save();

  res.status(201).json({
    comment: await Comment.findById(comment._id)
      .populate(userRelation)
      .exec()
  });
};

export const addReply = async (req, res) => {
  const { comment_id, user_id, content } = req.body;
  const comment = await new Comment({
    user: user_id,
    content: content,
    type: "reply"
  }).save();
  console.log(comment);
  const response = await Comment.findByIdAndUpdate(comment_id, {
    $push: {
      reply: comment._id
    }
  });
  res.status(201).json({
    reply: comment
  });
};

export const listReplies = async (req, res) => {
  const { id } = req.query;
  const comment = await Comment.findById(id)
    .populate({
      path: "reply",
      populate: {
        path: "user",
        model: "User"
      }
    })
    .exec();
  const reply = comment.reply;
  res.json({ replies: reply });
};

export const getLikes = async (req, res) => {
  const { id } = req.query;
  const comment = await Comment.findById(id);
  const likes = comment.likes;
  res.status(200).json({ likes, count: likes.length });
};

export const changeLikes = async (req, res) => {
  const { id } = req.query;
  const { userid } = req.body;
  let message = "";
  let comment = await Comment.findById(id);
  let likesArray = comment.likes;
  const index = likesArray.findIndex(like => like == userid);
  if (index !== -1) {
    likesArray = likesArray.filter(like => like != userid);
    message = "Remove";
  } else {
    likesArray.push(userid);
    message = "Add";
  }

  const upComment = await Comment.findByIdAndUpdate(id, {
    likes: likesArray
  });
  res.status(200).json({ message });
};
