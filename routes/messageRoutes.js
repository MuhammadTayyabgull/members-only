import express from "express";
import {
  createMessageGet,
  createMessagePost,
} from "../controllers/messageController.js";
import { isAuthenticated } from "../middleware/authMiddleWare.js";
import { messageValidation } from "../validators/messageValidator.js";

const router = express.Router();
router.get("/create", createMessageGet);
router.post("/create", isAuthenticated, messageValidation, createMessagePost);

export default router;
