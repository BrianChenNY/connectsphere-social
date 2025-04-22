import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Comments = ({ postId }) => {

  // 缓存postID
  // const [postId, setPostID] = useState(_postId);
  
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments", postId], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", postId]);
      },
    }
  );

  const deleteMutation = useMutation(
    (commentId) => {
      return makeRequest.delete("/comments/" + commentId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", postId]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  const handleDelete = (commentId) => {
    deleteMutation.mutate(commentId);
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="Comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "error"
        : isLoading
        ? "Loading..."
        : data.map((comment) => (
            <div key={comment.id} className="comment">
              <img src={"/upload/" + comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.description}</p>
              </div>
              <div className="interaction">
                <span className="date">
                  {moment(comment.createdAt).fromNow()}
                </span>
                {currentUser.id === comment.userId && (
                  <DeleteOutlineIcon
                    className="delete"
                    onClick={() => handleDelete(comment.id)}
                  />
                )}
              </div>
            </div>
          ))}
    </div>
  );
};

export default Comments;
