import express from "express";
import { login, register, logout } from "../controllers/auth.js";

const router = express.Router();

// router.get("/test", (req, res) => {
//   res.send("It works!");
// });

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;
