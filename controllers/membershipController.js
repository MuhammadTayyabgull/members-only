import pool from "../db/pool.js";

export const joinClubGet = (req, res) => {
  res.render("membership/join-club", { error: null });
};

import { validationResult } from "express-validator";

export const joinClubPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("membership/join-club", { error: errors.array()[0].msg });
  }

  const secretKey = req.body["secret-key"];
  
  let query = "";

  if (secretKey === process.env.MEMBERSHIP_SECRET) {
    query = "UPDATE users SET is_member = true WHERE id = $1 RETURNING *";
  } else if (secretKey === process.env.ADMIN_SECRET) {
    query = "UPDATE users SET is_member = true, is_admin = true WHERE id = $1 RETURNING *";
  } else {
    return res.status(401).render("membership/join-club", { error: "Invalid secret key" });
  }

  try {
    const result = await pool.query(query, [req.user.id]);
    if (req.user) {
      req.user.is_member = result.rows[0].is_member;
      req.user.is_admin = result.rows[0].is_admin;
    }
    res.redirect("/");
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).render("membership/join-club", { error: "Database error occurred" });
  }
};