import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = async (req, res) => {
  try {
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
    
    const [data] = await db.query(q, [req.query.followedUserId]);
    return res.status(200).json(data.map(relationship => relationship.followerUserId));
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    
    const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    const [data] = await db.query(q, [values]);
    return res.status(200).json("关注成功");
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("未登录！");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    
    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    const [data] = await db.query(q, [userInfo.id, req.query.userId]);
    return res.status(200).json("取消关注成功");
  } catch (err) {
    return res.status(500).json(err);
  }
};