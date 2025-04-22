import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDesc, setEditDesc] = useState(post.description);
  const [file, setFile] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data.map((like) => like.userId);
    })
  );

  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes", post.id]);
      },
    }
  );

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const editMutation = useMutation(
    async (updatedPost) => {
      let imgUrl = updatedPost.img;
      if (file) {
        const uploadRes = await upload();
        imgUrl = uploadRes;
      }
      return makeRequest.put("/posts/" + post.id, {
        ...updatedPost,
        img: imgUrl,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        setEditMode(false);
        setFile(null);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const handleEdit = () => {
    setEditMode(true);
    setMenuOpen(false);
  };

  const handleSave = async () => {
    editMutation.mutate({
      description: editDesc,
      img: post.img,
    });
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <div className="menu">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
        <div className="content">
          {editMode ? (
            <div className="editContent">
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
              <div className="fileUpload">
                <input
                  type="file"
                  id="editFile"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="editFile" className="uploadButton">
                  <CloudUploadIcon />
                  <span>ChangePicture</span>
                </label>
                {(file || post.img) && (
                  <img
                    src={
                      file ? URL.createObjectURL(file) : "/upload/" + post.img
                    }
                    alt=""
                    className="previewImage"
                  />
                )}
              </div>
              <div className="editButtons">
                <button onClick={handleSave}>Save</button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFile(null);
                    setEditDesc(post.description);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p>{post.description}</p>
              {post.img && <img src={"/upload/" + post.img} alt="" />}
            </>
          )}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "Loading..."
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon className="liked" onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon
                className="like"
                onClick={handleLike}
              />
            )}
            {data?.length} Like
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Show Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
