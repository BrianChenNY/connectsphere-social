import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    //CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE username = ?";
    const [rows] = await db.execute(q, [req.body.username]);
    
    if (rows.length) return res.status(409).json("User already exists!");
    
    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const insertQ = "INSERT INTO users (`username`,`email`,`password`,`name`,`city`,`website`,`profilePic`,`coverPic`) VALUES (?,?,?,?,?,?,?,?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
      '',
      '',
      'head.jpg',
      'bg.png',
    ];

    await db.execute(insertQ, values);
    return res.status(200).json("User has been created.");
  } catch (err) {
    console.error("注册错误:", err);
    return res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const q = "SELECT * FROM users WHERE username = ?";
    const [rows] = await db.execute(q, [req.body.username]);
    
    if (rows.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      rows[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: rows[0].id }, "secretkey");

    const { password, ...others } = rows[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })
      .status(200)
      .json(others);
  } catch (err) {
    console.error("登录错误:", err);
    return res.status(500).json(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};
