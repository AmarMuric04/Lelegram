import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setActiveChat } from "../store/redux/chatSlice.js";
import Aside from "../components/aside/Aside.jsx";
import { io } from "socket.io-client";

import { resetMessage, setValue } from "../store/redux/messageSlice.js";

import ConditionalModals from "../components/modal/ConditionalModals.jsx";
import ChatBackground from "../components/chat/ChatBackground.jsx";
import ActiveChat from "../components/chat/activeChat/ActiveChat.jsx";

const socket = io("http://localhost:3000");

export default function ChatPage() {
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);
  const { message, messageType, messageToEdit } = useSelector(
    (state) => state.message
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) navigate("/auth");
    console.log(user);
  }, [user, navigate]);

  useEffect(() => {
    if (messageType === "reply" && message.chat._id !== activeChat._id)
      dispatch(resetMessage());
    if (messageToEdit) dispatch(setValue(messageToEdit.message));
  }, [messageToEdit, activeChat, message, dispatch, messageType]);

  useEffect(() => {
    if (!chatId) dispatch(setActiveChat(null));
  }, [dispatch, chatId]);

  useEffect(() => {
    socket.on("messageSent", (message) => {
      console.log("New message:", message);
      queryClient.invalidateQueries(["messages", message.data]);
    });

    return () => {
      socket.off("messageSent");
    };
  }, [queryClient]);

  const handleGetChat = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/get-chat/" + chatId,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Couldn't fetch chat.");
      }

      dispatch(setActiveChat(data.data));

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useQuery({
    queryFn: handleGetChat,
    queryKey: ["chat", chatId],
    enabled: !!chatId,
    onSuccess: () => {
      queryClient.invalidateQueries(["chats"]);
    },
  });

  return (
    <main className="bg-[#202021] w-screen h-screen flex justify-center ">
      <ConditionalModals />
      <div className="w-[85vw] flex justify-between overflow-hidden">
        <Aside />
        <div className="relative w-[63.5vw] transition-all">
          <ChatBackground />
          <ActiveChat />
        </div>
      </div>
    </main>
  );
}
