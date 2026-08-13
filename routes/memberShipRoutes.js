import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleWare.js";
import { deleteMessagePost } from "../controllers/messageController.js";
import {
  joinClubGet,
  joinClubPost,
} from "../controllers/membershipController.js";
import { joinValidation } from "../validators/authValidator.js";

const router = Router();

router.get("/join", isAuthenticated, joinClubGet);
router.post("/join", isAuthenticated, joinValidation, joinClubPost);
router.post("/delete/:id", isAdmin, deleteMessagePost);

export default router;
