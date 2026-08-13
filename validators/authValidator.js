import { body } from "express-validator";

export const signupValidation = [
  body("firstname").trim().notEmpty(),
  body("lastname").trim().notEmpty(),
  body("email").trim().isEmail(),
  body("password").isLength({ min: 8 }),
  body("confirmPassword")
    .custom((value, req) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export const joinValidation = [
  body("secret-key").trim().notEmpty().withMessage("Secret key is required"),
];
