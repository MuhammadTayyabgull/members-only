import { Router } from "express";
import { createUser } from "../models/userModel.js";
import { body, validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import passport from "passport";
import { redirectIfLoggedIn } from "../middleware/authMiddleWare.js";
const router = Router();
router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  }),
);
router.get("/signup", redirectIfLoggedIn, (req, res) => {
  res.render("auth/signup", { errors: validationResult(req), formData: {} });
});

router.post(
  "/signup",
  body("firstname").trim().notEmpty().withMessage("First name is required"),
  body("lastname").trim().notEmpty().withMessage("Last Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be above 8 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth/signup", {
        errors: errors.array(),
        formData: req.body,
      });
    }
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const createdUser = await createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    if (createdUser === null) {
      return res.status(409).render("auth/signup", {
        errors: [{ msg: "This account already exists. Log in instead." }],
        formData: req.body,
      });
    }
    res.redirect("/");
    console.log("created user:", createdUser);
  },
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
