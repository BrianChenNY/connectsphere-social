import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      let q;
      let values;

      if (userId !== "undefined") {
        // 如果是查看特定用户的帖子
        if (userId === userInfo.id.toString()) {
          // 如果是查看自己的帖子
          q = `SELECT p.*, u.id AS userId, name, profilePic 
               FROM posts AS p 
               JOIN users AS u ON (u.id = p.userId) 
               WHERE p.userId = ? 
                  OR p.userId IN (
                    SELECT followedUserId 
                    FROM relationships 
                    WHERE followerUserId = ?
                  )
               ORDER BY p.createdAt DESC`;
          values = [userId, userId];
        } else {
          // 如果是查看其他用户的帖子，需要检查是否已关注
          q = `SELECT p.*, u.id AS userId, name, profilePic 
               FROM posts AS p 
               JOIN users AS u ON (u.id = p.userId) 
               WHERE p.userId = ? 
               AND (
                 EXISTS (
                   SELECT 1 
                   FROM relationships 
                   WHERE followerUserId = ? 
                   AND followedUserId = ?
                 )
                 OR ? = ?
               )
               ORDER BY p.createdAt DESC`;
          values = [userId, userInfo.id, userId, userInfo.id, userId];
        }
      } else {
        // 如果是查看首页的帖子流
        q = `SELECT p.*, u.id AS userId, name, profilePic 
             FROM posts AS p 
             JOIN users AS u ON (u.id = p.userId)
             LEFT JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)
             WHERE r.followerUserId = ? OR p.userId = ?
             ORDER BY p.createdAt DESC`;
        values = [userInfo.id, userInfo.id, userInfo.id];
      }

      const [data] = await db.query(q, values);
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json("获取帖子失败");
    }
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`description`, `img`, `userId`, `createdAt`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    try {
      const [data] = await db.query(q, [values]);
      res.status(200).json("Post has been created.");
    } catch (err) {
      console.error(err);
      res.status(500).json("创建帖子失败");
    }
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    try {
      const [data] = await db.query(q, [req.params.id, userInfo.id]);
      if (data.affectedRows > 0) {
        res.status(200).json("Post has been deleted.");
      } else {
        res.status(403).json("You can delete only your post!");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("删除帖子失败");
    }
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE posts SET `desc`=?, `img`=? WHERE `id`=? AND `userId`=?";

    try {
      const [data] = await db.query(q, [
        req.body.desc,
        req.body.img,
        req.params.id,
        userInfo.id,
      ]);
      if (data.affectedRows > 0) {
        res.status(200).json("Post has been updated.");
      } else {
        res.status(403).json("You can update only your post!");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("更新帖子失败");
    }
  });
};
