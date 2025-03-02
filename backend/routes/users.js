import express from "express";
import { getUser } from "../controllers/user.js";

const router = express.Router();

//set up API requirement here

// router.get("/test", (req, res) => {
//   res.send("It works!");
// });

router.get("/test", getUser);

router.get("/find/:userId", getUser);

export default router;
