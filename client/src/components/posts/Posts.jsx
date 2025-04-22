import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Posts = ({ userId }) => {
  const { currentUser } = useContext(AuthContext);
  
  const { isLoading, error, data } = useQuery(
    ["posts", userId], 
    () => {
      if(userId === undefined){
        userId = currentUser.id;
      }
      return makeRequest.get("/posts?userId=" + userId).then((res) => {
        return res.data;
      });
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 0,
      cacheTime: 0
    }
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
