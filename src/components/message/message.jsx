import React, { memo, useEffect, useRef, useState } from "react";
import "./message.css";
import "./message-mobile.css";
import { Layout, Typography, Input, Progress, Modal } from "antd";
import Person from "../../assets/Person.jpg";
import { SendOutlined, AreaChartOutlined } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import {
  updateMessages,
  getMessagesOfTwoUsers,
  refreshMessages,
} from "../../services/message-slice";
import SideBarIcon from "../../assets/SideBarIcon.png";
import { updateSideBarStatus } from "../../services/sidebar-slice";
import senderAndReceiverSlice from "../../services/sender-and-receiver-slice";

const { Title } = Typography;
const { Text } = Typography;

const socket = io("https://chatapp-backend-5tbb.onrender.com");

function Message() {
  const dispatch = useDispatch();
  const privateRoomOfUser = useSelector((state) => state.privateRoomSlice);
  const senderAndReceiver = useSelector(
    (state) => state.senderAndReceiverSlice
  );
  const messages = useSelector((state) => state.messageSlice);

  const [message, setMessage] = useState("");

  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [emojiModelOpen, setEmojiModalOpen] = useState(false);

  const scrollRef = useRef();

  const joinRoom = async () => {
    dispatch(refreshMessages());
    if (Object.keys(privateRoomOfUser.data).length != 0) {
      socket.emit("join-room", privateRoomOfUser.data._id);
      dispatch(
        getMessagesOfTwoUsers({
          user1Id: senderAndReceiver.data.messageSender,
          user2Id: senderAndReceiver.data.messageReceiver,
        })
      );
    }
  };

  const sendMessage = async () => {
    socket.emit("send-message", {
      message: message,
      room: privateRoomOfUser.data._id,
      messageSender: senderAndReceiver.data.messageSender,
      messageReceiver: senderAndReceiver.data.messageReceiver,
    });
    dispatch(
      updateMessages({
        senderId: senderAndReceiver.data.messageSender,
        message: message,
      })
    );

    setTimeout(() => {
      setMessage("");
    }, 500);
  };

  const receiveMessage = () => {
    const handleReceiveMessage = (data) => {
      setArrivalMessage({
        senderId: senderAndReceiver.data.messageReceiver,
        message: data.message,
      });
    };

    // Remove existing event listener (if any) and add a new one
    socket.off("receive-message", handleReceiveMessage);
    socket.on("receive-message", handleReceiveMessage);
  };

  const onChangeMessageText = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageByEnter = (event) => {
    if (event.key === "Enter") {
      sendMessage();
      setMessage("");
    }
  };

  const showSideBarDrawer = () => {
    dispatch(updateSideBarStatus(true));
  };

  const modalEmojiOpener = () => {
    setEmojiModalOpen(true);
  };
  const modalEmojiCloser = () => {
    setEmojiPicker(false);
    setEmojiModalOpen(false);
  };

  const onEmojiClick = (emojiObject, event) => {
    console.log(emojiObject);
    setMessage((prevInput) => prevInput + emojiObject.emoji);

    setEmojiPicker(false);
    setEmojiModalOpen(false);
  };

  useEffect(() => {
    joinRoom();
    receiveMessage();
  }, [privateRoomOfUser.data]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
    document.getElementById("messages-container").scrollTop =
      document.getElementById("messages-container").scrollHeight;
  }, [messages]);

  useEffect(() => {
    arrivalMessage && dispatch(updateMessages(arrivalMessage));
  }, [arrivalMessage]);

  return (
    <Layout id="messages-layout">
      <div id="message-receiver-heading-container" onClick={showSideBarDrawer}>
        {privateRoomOfUser.data && privateRoomOfUser.data._id ? (
          <>
            <img src={Person} alt="" id="message-receiver-image" />
            <div id="message-receiver-name-and-active-status-container">
              <h4 id="message-receiver-name">
                {senderAndReceiver.data.messageReceiverName}
              </h4>
              <h6>Active Now</h6>
            </div>
          </>
        ) : null}
      </div>

      <div id="messages-container">
        {messages.data &&
          messages.data.map((m, i) =>
            m.senderId === senderAndReceiver.data.messageSender ? (
              messages.isLoader == true ? (
                <Progress
                  type="dashboard"
                  percent={50}
                  size={20}
                  className="progress-animation"
                />
              ) : (
                <div className="outgoing-messages" key={i}>
                  {m.message}
                </div>
              )
            ) : messages.isLoader == true ? (
              <Progress
                type="dashboard"
                percent={50}
                size={20}
                className="progress-animation"
              />
            ) : (
              <div className="incoming-messages" key={i}>
                {m.message}
              </div>
            )
          )}
      </div>

      <div id="messages-input-container">
        <Input
          id="type-messages"
          placeholder="Type Something"
          autoFocus={true}
          value={message}
          onChange={onChangeMessageText}
          onKeyUp={sendMessageByEnter}
        />

        <AreaChartOutlined
          className="insert-emoji"
          onClick={() => {
            setEmojiPicker((val) => !val);
            modalEmojiOpener();
          }}
          style={{ fontSize: 25 }}
        />
        <Modal
          open={emojiModelOpen}
          onCancel={() => setEmojiModalOpen(false)}
          onOk={() => setEmojiModalOpen(false)}
        >
          <div className="modal-box" onClick={modalEmojiCloser}>
            {emojiPicker && (
              <EmojiPicker emojiStyle="google" onEmojiClick={onEmojiClick} />
            )}
          </div>
        </Modal>

        <SendOutlined id="send-btn" onClick={sendMessage} />
      </div>
    </Layout>
  );
}

export default memo(Message);
