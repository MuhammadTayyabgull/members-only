
import { body } from "express-validator";

export const messageValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be 100 characters or less"),

    body("text")
        .trim()
        .notEmpty()
        .withMessage("Message text is required")
];