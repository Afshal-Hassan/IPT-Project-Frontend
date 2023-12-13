import React from "react";
import "./user.css";
import { Layout, Typography, Progress, notification } from "antd";
import { SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getFriendsOfUser } from "../../services/friend-slice";
import { getPrivateRoomOfUser } from "../../services/private-room-slice";
import { updateSenderAndReceiverData } from "../../services/sender-and-receiver-slice";
import { memo } from "react";
import { getMessagesOfTwoUsers } from "../../services/message-slice";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Text } = Typography;

function Users() {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();
  const listOfFriends = useSelector((state) => state.friendSlice);

  const [searchValue, setSearchValue] = useState("");
  const [userId, setUserId] = useState(null);

  const onSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const getPrivateRoom = async (friend) => {
    const data = {
      user1Id: userId,
      user2Id: friend._id,
    };
    try {
      dispatch(getPrivateRoomOfUser(data));
      dispatch(
        updateSenderAndReceiverData({
          messageSender: userId,
          messageReceiver: friend._id,
          messageReceiverProfilePic: friend.profilePic,
          messageReceiverName: friend.name,
        })
      );
    } catch (error) {
      if (error.response && error.response.status === 429) {
        openNotificationWithIcon(
          "error",
          "Too Many Requests",
          "Try again later..."
        );
      } else {
        console.log(error);
      }
    }
  };

  const getAllFriendsList = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const newUserId = user ? user.user.userId : null;
    setUserId(newUserId);

    if (newUserId != null) {
      const response = await dispatch(getFriendsOfUser(newUserId));
      if (response.payload.length > 0) {
        try {
          dispatch(
            getPrivateRoomOfUser({
              user1Id: newUserId,
              user2Id: response.payload[0].friendId._id,
            })
          );

          dispatch(
            updateSenderAndReceiverData({
              messageSender: newUserId,
              messageReceiver: response.payload[0].friendId._id,
              messageReceiverProfilePic:
                response.payload[0].friendId.profilePic,
              messageReceiverName: response.payload[0].friendId.name,
            })
          );

          dispatch(
            getMessagesOfTwoUsers({
              user1Id: newUserId,
              user2Id: response.payload[0].friendId._id,
            })
          );
        } catch (error) {
          if (error.response && error.response.status === 429) {
            openNotificationWithIcon(
              "error",
              "Too Many Requests",
              "Try again later..."
            );
          } else {
            console.log(error);
          }
        }
      }
    }
  };

  const logOut = () => {
    localStorage.clear();

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  useEffect(() => {
    getAllFriendsList();
  }, []);

  return (
    <Layout id="users-layout">
      <div id="users-layout-chat-heading-container">
        <Title level={3} id="user-admin-chats-heading">
          Chats
        </Title>
        <LogoutOutlined
          style={{
            color: "white",
            fontSize: 17,
            position: "relative",
            top: 8.5,
            right: 15,
          }}
          onClick={logOut}
        />
      </div>

      <div id="chat-search">
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
      ) : searchValue === "" ? (
        listOfFriends.data &&
        listOfFriends.data.map(({ friendId }, i) => (
          <div
            className="user-data-container"
            key={i}
            onClick={() => getPrivateRoom(friendId)}
          >
            <img src={`${friendId.profilePic}`} alt="" className="user-image" />
            <Text className="user-name">{friendId.name}</Text>
          </div>
        ))
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
              {console.log(friendId.profilePic)}
              <img
                src={`${friendId.profilePic}`}
                alt=""
                className="user-image"
              />
              <Text className="user-name">{friendId.name}</Text>
            </div>
          ))
      )}
      {contextHolder}
    </Layout>
  );
}

export default memo(Users);
