import express from "express";
import { getUser, updateUser, getSuggestions, getFollowedUsers } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/suggestions", getSuggestions);
router.get("/followed", getFollowedUsers);
router.put("/", updateUser);

export default router;