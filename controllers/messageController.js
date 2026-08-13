import {
  getAllMessagesWithAuthors,
  createMessage,
  deleteMessage,
} from "../models/messagesModel.js";

const allMessagesGet = async (req, res) => {
  const allMessages = await getAllMessagesWithAuthors();
  res.render("index", { allMessages });
};
const createMessageGet = (req, res) => {
  res.render("messages/new-messages");
};
import { validationResult } from "express-validator";

const createMessagePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("messages/new-messages", {
      errors: errors.array(),
    });
  }

  const { title, text } = req.body;
  const message = await createMessage({ title, text, user_id: req.user.id });
  res.redirect("/");
};

const deleteMessagePost = async (req, res) => {
  const deletedMessage = await deleteMessage(req.params.id);
  res.redirect("/");
};

export {
  allMessagesGet,
  createMessageGet,
  createMessagePost,
  deleteMessagePost,
};
