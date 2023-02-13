import express from "express";
import photos from "./photos";
import profile from "./profile";
import { login, refresh, register } from "../controllers/ex.user_controller";
import { createUserRules, createLoginRules } from "../validations/user_rules";
import { validateToken } from "../middlewares/auth/jwt";

// instantiate a new router
const router = express.Router();

/**
 * GET /
 */
router.get("/", (req, res) => {
  res.send({
    message: "I AM API, BEEP BOOP",
  });
});

/**
 * /register
 */
router.post("/register", createUserRules, register);

/**
 * POST /login
 */
router.post("/login", createLoginRules, login);

/**
 * POST /refresh
 */
//router.use('/profile', basic, profile)
router.use("/refresh", refresh);

/**
 * photos
 */
router.use("/photos",validateToken, photos); //validate token

/**
 * /profile // for testing purposes only
 */
router.use("/profile",validateToken, profile); //validate token

export default router;
