import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  console.log("userId in Posts component:", userId); // Debugging userId

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId], // Correct format for V5 react query
    queryFn: async () => {
      const url = userId ? `/posts?userId=${userId}` : "/posts";
      console.log("Fetching posts from:", url);
      console.log("UserId passed to Posts component:", userId);
      const res = await makeRequest.get(url);
      return res.data;
    },
  });

  console.log(data);

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
