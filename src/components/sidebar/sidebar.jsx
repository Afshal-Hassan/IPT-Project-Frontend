import React, { useState } from "react";
import "./sidebar.css";
import { useSelector } from "react-redux";
import { updateSideBarStatus } from "../../services/sidebar-slice";
import {
  SearchOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Drawer, Typography, Progress } from "antd";
import Person from "../../assets/Person.jpg";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getFriendsOfUser } from "../../services/friend-slice";
import { getPrivateRoomOfUser } from "../../services/private-room-slice";
import { updateSenderAndReceiverData } from "../../services/sender-and-receiver-slice";
import { getMessagesOfTwoUsers } from "../../services/message-slice";

const { Title } = Typography;
const { Text } = Typography;

function Sidebar() {
  const dispatch = useDispatch();
  const sideBarSlice = useSelector((state) => state.sidebarSlice);
  const listOfFriends = useSelector((state) => state.friendSlice);

  const [searchValue, setSearchValue] = useState("");
  const [userId, setUserId] = useState(null);

  const onSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const getPrivateRoom = async (friend) => {
    const data = {
      user1Id: userId,
      user2Id: friend._id,
    };

    dispatch(getPrivateRoomOfUser(data));
    dispatch(
      updateSenderAndReceiverData({
        messageSender: userId,
        messageReceiver: friend._id,
        messageReceiverName: friend.name,
      })
    );

    setTimeout(() => {
      closeSideBar();
    }, 500);
  };

  const getAllFriendsList = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const newUserId = user ? user.user.userId : null;
    setUserId(newUserId);

    if (newUserId != null) {
      dispatch(getFriendsOfUser(newUserId));
    }
  };

  const closeSideBar = () => {
    dispatch(updateSideBarStatus(false));
  };

  useEffect(() => {
    getAllFriendsList();
  }, []);

  return (
    <Drawer
      id="sidebar-sider"
      placement="right"
      closable={true}
      open={sideBarSlice.data}
      onClose={closeSideBar}
      closeIcon={<CloseOutlined style={{ color: "white" }} />}
    >
      <div id="users-layout-chat-heading-container-sidebar">
        <Title level={3} id="user-admin-chats-heading">
          Chats
        </Title>
        <LogoutOutlined
          style={{
            color: "white",
            fontSize: 17,
            position: "relative",
            top: 8.5,
          }}
        />
      </div>

      <div id="chat-search" className="chat-sidebar">
        <SearchOutlined style={{ color: "darkslategray" }} />
        <input placeholder="Search" id="search-input" onChange={onSearch} />
      </div>

      {listOfFriends.isLoader === true ? (
        <Progress
          type="dashboard"
          percent={50}
          size={20}
          className="progress-animation"
        />
      ) : (
        listOfFriends.data
          .filter(({ friendId }) =>
            friendId.name
              .toLocaleUpperCase()
              .includes(searchValue.toLocaleUpperCase())
          )
          .map(({ friendId }, i) => (
            <div
              className="user-data-container"
              key={i}
              onClick={() => getPrivateRoom(friendId)}
            >
              <img src={Person} alt="" className="user-image" />
              <Text className="user-name">{friendId.name}</Text>
            </div>
          ))
      )}
    </Drawer>
  );
}

export default Sidebar;
