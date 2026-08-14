// app.js
import "dotenv/config";
import { errorHandler } from "./middleware/errorMiddleWare.js";
import express from "express";
import layouts from "express-ejs-layouts";
import messageRoutes from "./routes/messageRoutes.js";
import pool from "./db/pool.js";
import pgSession from "connect-pg-simple";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import getHome from "./controllers/homeController.js";
import memberShipRoutes from "./routes/memberShipRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
const pgStore = pgSession(session);
app.use(
  session({
    store: new pgStore({
      pool: pool,
      tableName: "user_sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.json());
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/", getHome);
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/membership", memberShipRoutes);

try {
  const result = await pool.query("SELECT NOW()");

  console.log("Database connected successfully!");
  console.log("Database time: ", result.rows[0].now);
} catch (err) {
  console.error("Error connecting to database", err);
}

app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
