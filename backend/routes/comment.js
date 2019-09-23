import express from "express";
import {
  listComments,
  createComment,
  addReply,
  listReplies,
  getLikes,
  changeLikes
} from "../controllers/comments";

const app = express();
const router = express.Router();

router
  .route("/")
  .get(listComments)
  .post(createComment)
  .put(addReply);

router.route("/getReplies").get(listReplies);
router
  .route("/likes")
  .get(getLikes)
  .put(changeLikes);

export default router;
