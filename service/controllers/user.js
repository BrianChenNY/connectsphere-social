import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUser = async (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  const [data] = await db.query(q, [userId]);
  const { password, ...info } = data[0];
  return res.json(info);

  // db.query(q, [userId], (err, data) => {
  //   if (err) return res.status(500).json(err);
  //   const { password, ...info } = data[0];
  //   return res.json(info);
  // });
};

export const getSuggestions = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    
    // 获取除了当前用户之外的所有用户
    const q = `
      SELECT id, username, name, profilePic 
      FROM users 
      WHERE id != ? 
      AND id NOT IN (
        SELECT followedUserId 
        FROM relationships 
        WHERE followerUserId = ?
      )
      LIMIT 5
    `;

    const [users] = await db.query(q, [userInfo.id, userInfo.id]);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json("获取推荐用户失败");
  }
};

export const getFollowedUsers = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    
    // 获取当前用户关注的所有用户
    const q = `
      SELECT u.id, u.username, u.name, u.profilePic 
      FROM users u
      INNER JOIN relationships r ON (u.id = r.followedUserId)
      WHERE r.followerUserId = ?
    `;

    const [users] = await db.query(q, [userInfo.id]);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json("获取已关注用户失败");
  }
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");


    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    const [data] = await db.query(q, [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.profilePic,
      req.body.coverPic,
      userInfo.id,
    ]);


    if (req.body.password && Array.isArray(req.body.password) && req.body.password[0]) {
      let pw = req.body.password[0];
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(pw, salt);
      const q = "UPDATE users SET `password`=? WHERE id=?";
      await db.query(q, [hashedPassword, userInfo.id]);
    }


    if (data.affectedRows > 0) {
      return res.json("Updated!");
    }
    return res.status(403).json("You can update only your post!");

    //   db.query(
    //     q,
    //     [
    //       req.body.name,
    //       req.body.city,
    //       req.body.website,
    //       req.body.coverPic,
    //       req.body.profilePic,
    //       userInfo.id,
    //     ],
    //     (err, data) => {
    //       if (err) res.status(500).json(err);
    //       if (data.affectedRows > 0) return res.json("Updated!");
    //       return res.status(403).json("You can update only your post!");
    //     }
    //   );
    });
  };
