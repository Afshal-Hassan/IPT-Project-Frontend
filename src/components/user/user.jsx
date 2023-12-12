import React from "react";
import "./user.css";
import { Layout, Typography, Progress } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Person from "../../assets/Person.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getFriendsOfUser } from "../../services/friend-slice";
import { getPrivateRoomOfUser } from "../../services/private-room-slice";
import { updateSenderAndReceiverData } from "../../services/sender-and-receiver-slice";
import { memo } from "react";
import { getMessagesOfTwoUsers } from "../../services/message-slice";

const { Title } = Typography;
const { Text } = Typography;

function Users() {
  const dispatch = useDispatch();
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
  };

  const getAllFriendsList = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const newUserId = user ? user.user.userId : null;
    setUserId(newUserId);

    if (newUserId != null) {
      const response = await dispatch(getFriendsOfUser(newUserId));
      if (response.payload.length > 0) {
        getPrivateRoom(response.payload[0]);
        // dispatch(
        //   getMessagesOfTwoUsers({
        //     user1Id: newUserId,
        //     user2Id: response.payload[0]._id,
        //   })
        // );
      }
    }
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
            <img src={Person} alt="" className="user-image" />
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
              <img src={Person} alt="" className="user-image" />
              <Text className="user-name">{friendId.name}</Text>
            </div>
          ))
      )}
    </Layout>
  );
}

export default memo(Users);
