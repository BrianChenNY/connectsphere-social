import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {



  const q = "SELECT userId FROM likes WHERE postId = ?";

  const [data] = await db.query(q, [req.query.postId]);
  res.status(200).json(data);
  // db.query(q, [req.query.postId], (err, data) => {
  //   if (err) return res.status(500).json(err);
  //   return res.status(200).json(data.map(like => like.userId));
  // });
}

export const addLike = (req, res) => {




  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId
    ];


    try {
      const [data] = await db.query(q, [values]);
      res.status(200).json(data);
    } catch (error) {
      res.status(200).json("Post has been liked.")
    }
 

    // return res.status(200).json("Post has been liked.");

    // db.query(q, [values], (err, data) => {
    //   if (err) return res.status(500).json(err);
    //   return res.status(200).json("Post has been liked.");
    // });
  });
};

export const deleteLike = (req, res) => {
  console.log('取消点赞执行了');
  
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    try {
      const [data] = await db.query(q, [userInfo.id, req.query.postId]);
      res.status(200).json(data);
    } catch (error) {
      res.status(200).json("Post has been disliked.")
    }

    // db.query(q, [userInfo.id, req.query.postId], (err, data) => {
    //   if (err) return res.status(500).json(err);
    //   return res.status(200).json("Post has been disliked.");
    // });
  });
};