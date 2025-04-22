import "./rightBar.scss";
import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Get recommended users
  const fetchUsers = async () => {
    try {
      const res = await makeRequest.get("/users/suggestions");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get followed users
  const { data: followedUsers, isLoading: followedLoading } = useQuery(
    ["followedUsers"],
    async () => {
      const res = await makeRequest.get("/users/followed");
      return res.data;
    },
    {
      enabled: !!currentUser,
    }
  );

  // Follow user
  const followMutation = useMutation({
    mutationFn: (userId) => {
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationships"]);
      queryClient.invalidateQueries(["followedUsers"]);
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // Unfollow user
  const unfollowMutation = useMutation({
    mutationFn: (userId) => {
      return makeRequest.delete(`/relationships?userId=${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationships"]);
      queryClient.invalidateQueries(["followedUsers"]);
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // Ignore user (remove from recommendations)
  const handleIgnore = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleFollow = async (userId) => {
    try {
      await followMutation.mutateAsync(userId);
      // Remove followed user from recommendations
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowMutation.mutateAsync(userId);
      // Get unfollowed user info
      const unfollowedUser = followedUsers.find(user => user.id === userId);
      if (unfollowedUser) {
        // Add unfollowed user back to recommendations
        setUsers(prev => [unfollowedUser, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Listen to followed users list changes, remove followed users from recommendations
  useEffect(() => {
    if (followedUsers) {
      const followedIds = followedUsers.map(user => user.id);
      setUsers(prev => prev.filter(user => !followedIds.includes(user.id)));
    }
  }, [followedUsers]);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Recommended Users</span>
          <div className="user-list">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div className="user" key={user.id}>
                  <div className="userInfo">
                    <img
                      src={user.profilePic ? "/upload/" + user.profilePic : "/upload/default.png"}
                      alt={user.name}
                    />
                    <Link 
                      to={`/profile/${user.id}`}
                      style={{textDecoration: "none", color: "inherit"}}
                    >
                      <span>{user.name}</span>
                    </Link>
                  </div>
                  <div className="buttons">
                    <button 
                      onClick={() => handleFollow(user.id)}
                      disabled={followMutation.isLoading}
                    >
                      {followMutation.isLoading ? "Following..." : "Follow"}
                    </button>
                    <button onClick={() => handleIgnore(user.id)}>Ignore</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-users">No recommended users</div>
            )}
          </div>
        </div>
        <div className="item">
          <span>Following</span>
          <div className="user-list">
            {followedLoading ? (
              <div className="loading">Loading...</div>
            ) : followedUsers && followedUsers.length > 0 ? (
              followedUsers.map((user) => (
                <div className="user" key={user.id}>
                  <div className="userInfo">
                    <img
                      src={user.profilePic ? "/upload/" + user.profilePic : "/upload/default.png"}
                      alt={user.name}
                    />
                    <Link 
                      to={`/profile/${user.id}`}
                      style={{textDecoration: "none", color: "inherit"}}
                    >
                      <span>{user.name}</span>
                    </Link>
                  </div>
                  <div className="buttons">
                    <button 
                      onClick={() => handleUnfollow(user.id)}
                      disabled={unfollowMutation.isLoading}
                      className="unfollow"
                    >
                      {unfollowMutation.isLoading ? "Unfollowing..." : "Unfollow"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-users">No following users</div>
            )}
          </div>
        </div>
        <div className="item" style={{display: "none"}}>
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="/upload/default.png"
                alt=""
              />
              <div className="online" />
              <span>No online friends</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
