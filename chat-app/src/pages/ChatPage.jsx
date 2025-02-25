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
import { protectedFetchData } from "../utility/async.js";
import { Helmet } from "react-helmet-async";

const socket = io(import.meta.env.VITE_SERVER_PORT || "http://localhost:3000");

export default function ChatPage() {
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.userSettings);
  const { activeChat } = useSelector((state) => state.chat);
  const { message, messageType, messageToEdit } = useSelector(
    (state) => state.message
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) navigate("/");
  }, [user, navigate, token]);

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
      // console.log("New message:", message);
      queryClient.invalidateQueries(["messages", message.data]);
    });

    return () => {
      socket.off("messageSent");
    };
  }, [queryClient]);

  const { data, error } = useQuery({
    queryFn: () => protectedFetchData(`/chat/get-chat/${chatId}`, token),
    queryKey: ["chat", chatId],
    enabled: !!chatId,
  });

  useEffect(() => {
    if (data) {
      dispatch(setActiveChat(data.data));
    }
  }, [data, dispatch, queryClient]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching chat data:", error);
    }
  }, [error]);

  if (!user || !user._id) return <p>Please wait...</p>;

  return (
    <>
      <Helmet>
        <title>Lelegram | Chat</title>
        <meta
          name="description"
          content="The place where you can express your thoughts."
        />
      </Helmet>
      <main
        className={`${theme} transition-all theme-bg w-screen h-screen flex justify-center`}
      >
        <ConditionalModals />
        <div className="w-[85vw] flex justify-between overflow-hidden">
          <Aside theme={theme} />
          <div className="relative w-[63.5vw] transition-all">
            <ChatBackground />
            <ActiveChat />
          </div>
        </div>
      </main>
    </>
  );
}
