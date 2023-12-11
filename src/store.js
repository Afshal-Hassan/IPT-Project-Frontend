import { configureStore } from "@reduxjs/toolkit";
import FriendSlice from "./services/friend-slice";
import MessageSlice from "./services/message-slice";
import PrivateRoomSlice from "./services/private-room-slice";
import SenderAndReceiverSlice from "./services/sender-and-receiver-slice";
import SidebarSlice from "./services/sidebar-slice";

const store = configureStore({
  reducer: {
    friendSlice: FriendSlice,
    messageSlice: MessageSlice,
    privateRoomSlice: PrivateRoomSlice,
    senderAndReceiverSlice: SenderAndReceiverSlice,
    sidebarSlice: SidebarSlice,
  },
});

export default store;
