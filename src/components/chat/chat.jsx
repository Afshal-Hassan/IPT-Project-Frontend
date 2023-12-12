import React, { memo, useEffect, useState } from "react";
import "./chat.css";
import User from "../user/user";
import Message from "../message/message";
import Sidebar from "../sidebar/sidebar";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();

  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  const calculateDeviceWidth = () => {
    setDeviceWidth(window.innerWidth);
  };

  useEffect(() => {
    if (!localStorage.getItem("jwt") && !localStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", calculateDeviceWidth);

    return () => {
      window.removeEventListener("resize", calculateDeviceWidth);
    };
  }, []);

  return (
    <div id="chat-layout">
      {deviceWidth > 1067 ? <User /> : <Sidebar />}

      <Message />
    </div>
  );
}

export default memo(Chat);
