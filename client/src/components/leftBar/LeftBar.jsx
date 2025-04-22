import "./leftBar.scss";
import Friends from "../../assets/Friends.png";
import Groups from "../../assets/Groups.png";
import Market from "../../assets/marketplace.png";
import Watch from "../../assets/tv.png";
import Memories from "../../assets/Memories.png";
import Events from "../../assets/Events.png";
import Gaming from "../../assets/gaming.png";
import Gallery from "../../assets/gallery-fill.png";
import Videos from "../../assets/icon_videos.png";
import Messages from "../../assets/087-messages.png";
import Tutorials from "../../assets/Tutorials.png";
import Courses from "../../assets/aislogo.png";
import Fund from "../../assets/Fundraiser.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(`/profile/${currentUser.id}`);
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user" onClick={handleUserClick} style={{ cursor: "pointer" }}>
            <img
              src={"/upload/" + currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>
          <div className="item">
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
