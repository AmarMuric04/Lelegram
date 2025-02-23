import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessagesList from "../../message/MessagesList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  setForwardedChat,
  setIsSelecting,
  setMessage,
  setMessageType,
} from "../../../store/redux/messageSlice";
import { useNavigate, useParams } from "react-router-dom";
import { setSelected } from "../../../store/redux/authSlice";
import { openModal } from "../../../store/redux/modalSlice";

import ActiveChatHeader from "./ActiveChatHeader";
import ChatImage from "../ChatImage.jsx";
import ActiveChatInput from "./ActiveChatInput.jsx";
import {
  protectedFetchData,
  protectedPostData,
} from "../../../utility/async.js";
import { io } from "socket.io-client";
import {
  copyToClipboard,
  getRecentTime,
  uploadToCloudinary,
} from "../../../utility/util.js";
import ModifyTab from "../ModifyTab.jsx";

const socket = io(import.meta.env.VITE_SERVER_PORT);

export default function ActiveChat() {
  const [viewChatInfo, setViewChatInfo] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeSelect, setActiveSelect] = useState("members");
  const [editingChannel, setEditingChannel] = useState(false);

  const messagesListRef = useRef(null);
  const { chatId } = useParams();

  const { selected, isSelecting } = useSelector((state) => state.message);
  const { activeChat } = useSelector((state) => state.chat);
  const [typeIndicator, setTypeIndicator] = useState({});
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("userTyping", ({ chatId, user: typingUser }) => {
      if (chatId === activeChat?._id && typingUser._id !== user._id) {
        setTypeIndicator((prev) => {
          let currentUsers = prev[chatId] || [];
          if (!currentUsers.some((u) => u._id === typingUser._id)) {
            return { ...prev, [chatId]: [...currentUsers, typingUser] };
          }
          return prev;
        });
      }
    });

    socket.on("userStoppedTyping", ({ chatId, user }) => {
      if (chatId === activeChat?._id) {
        setTypeIndicator((prev) => {
          const updatedUsers = prev[chatId]?.filter((u) => u._id !== user._id);
          if (updatedUsers?.length === 0) {
            const newState = { ...prev };
            delete newState[chatId];

            return newState;
          }
          return { ...prev, [chatId]: updatedUsers };
        });
      }
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [activeChat, user]);

  useEffect(() => {
    socket.emit("joined-chat", { chatId, user });
  }, [chatId, user]);

  const { mutate: editChannel } = useMutation({
    mutationFn: async ({ data }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);

      if (data.url) {
        const uploadedImageUrl = await uploadToCloudinary(data.url);
        if (uploadedImageUrl) {
          formData.append("imageUrl", uploadedImageUrl);
        }
      }

      return protectedPostData(
        `/chat/edit-chat/${activeChat._id}`,
        formData,
        token
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["chat"]),
  });

  queryClient.setQueryData(["chats", "users"], (oldChats) => {
    if (!oldChats?.data?.chats || !activeChat?._id) return oldChats;

    const chatIndex = oldChats.data.chats.findIndex(
      (c) => c._id === activeChat._id
    );

    if (chatIndex === -1) return oldChats;

    const updatedChats = oldChats.data.chats.map((chat, index) =>
      index === chatIndex ? { ...chat, missedCount: 0 } : chat
    );

    return {
      ...oldChats,
      data: {
        ...oldChats.data,
        chats: updatedChats,
      },
    };
  });

  const { data: messages, msgIsLoading } = useQuery({
    queryFn: () => protectedFetchData(`/message/get-messages/${chatId}`, token),
    queryKey: ["messages", activeChat?._id],
    enabled: !!activeChat,
  });

  const { mutate: createDirectMessage } = useMutation({
    mutationFn: ({ userId }) =>
      protectedPostData("/user/create-direct-message", { userId }, token),
    onSuccess: (data) => navigate("/k/" + data.chat._id),
  });

  if (!user || !activeChat) return;

  const isInChat = activeChat?.users?.some(
    (u) => u._id.toString() === user._id
  );

  const showUsers =
    activeSelect === "members" ? activeChat?.users : activeChat?.admins;

  const isAdmin = activeChat?.admins?.some(
    (u) => u._id.toString() === user._id
  );

  let otherUser;
  let displayName = activeChat?.name;
  if (
    activeChat.type === "private" &&
    Array.isArray(activeChat.users) &&
    user
  ) {
    otherUser = activeChat?.users.find(
      (u) => u?._id.toString() !== user?._id?.toString()
    );
  }
  if (otherUser) {
    displayName = `${otherUser.firstName} ${otherUser.lastName}`;
  }

  return (
    <div className="flex w-[63.5vw] overflow-hidden theme-text">
      <div
        className={`transition-all ${
          viewChatInfo ? "min-w-[42vw]" : "min-w-[63.5vw]"
        }`}
      >
        <div className="relative h-screen w-full  flex flex-col items-center">
          <ActiveChatHeader setViewChatInfo={setViewChatInfo} />

          <div
            className={`flex flex-col justify-end gap-2 transition-all h-[92%] w-full`}
          >
            <div className="flex flex-col w-full items-center justify-end min-h-[100%] max-h-[100%]">
              <div
                className={`transition-all flex justify-end h-full overflow-y-auto ${
                  viewChatInfo ? "w-[80%]" : "w-[55%]"
                } flex-col gap-2`}
              >
                {msgIsLoading && (
                  <div className="w-full grid place-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
                      >
                        <animateTransform
                          attributeName="transform"
                          dur="0.75s"
                          repeatCount="indefinite"
                          type="rotate"
                          values="0 12 12;360 12 12"
                        />
                      </path>
                    </svg>
                  </div>
                )}
                {messages && (
                  <MessagesList
                    viewChatInfo={viewChatInfo}
                    ref={messagesListRef}
                    messages={messages}
                    viewInfo={viewChatInfo}
                    setShowScrollButton={setShowScrollButton}
                  />
                )}
                <div className="relative min-h-[3.5rem] z-10 flex justify-between items-end gap-2 w-full">
                  {isSelecting && (
                    <div
                      className={`${
                        !isInChat && "jumpInAnimation"
                      } absolute left-1/2 -translate-x-1/2 transition-all sidepanel flex gap-4 px-4 py-2 h-full rounded-2xl z-10 items-center w-[70%] justify-between`}
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            dispatch(setIsSelecting(false));
                            dispatch(setSelected([]));
                          }}
                          className="hover:bg-[#8675DC20] cursor-pointer transition-all p-2  rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            className="theme-text-2"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeWidth="2"
                              d="M20 20L4 4m16 0L4 20"
                            />
                          </svg>
                        </button>
                        <p className="font-semibold flex-shrink-0">
                          {selected.length} Messages
                        </p>
                      </div>
                      <div className="w-1/2 flex">
                        <button
                          disabled={!selected.length}
                          onClick={() => {
                            dispatch(openModal("forward-to-channels"));
                            dispatch(setMessageType("forward"));
                            dispatch(setMessage(selected));
                            dispatch(setForwardedChat(null));
                          }}
                          className={`${
                            !selected.length && "opacity-50 pointer-events-none"
                          } flex w-full py-2  px-2 items-center gap-4 rounded-md  theme-hover-bg-2 transition-all cursor-pointer`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            className="theme-text-2 -scale-x-100"
                          >
                            <path
                              fill="currentColor"
                              d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16 16 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"
                            />
                          </svg>
                          <p className="font-semibold">Forward</p>
                        </button>
                        <button
                          disabled={
                            !isInChat ||
                            !selected.length ||
                            (!isAdmin &&
                              selected.some((s) => s.sender._id !== user._id))
                          }
                          onClick={() => {
                            dispatch(openModal("delete-message"));
                            dispatch(setMessage(selected));
                          }}
                          className={`${
                            !isInChat ||
                            !selected.length ||
                            (!isAdmin &&
                              selected.some((s) => s.sender._id !== user._id))
                              ? "opacity-50 pointer-events-none"
                              : ""
                          } flex w-full py-2  px-2 items-center gap-4 text-red-500 hover:bg-red-500/10 rounded-md transition-all cursor-pointer`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                            />
                          </svg>
                          <p className="font-semibold">Delete</p>
                        </button>
                      </div>
                    </div>
                  )}
                  <ActiveChatInput
                    setTypeIndicator={setTypeIndicator}
                    showScrollButton={showScrollButton}
                  />
                </div>
                {typeIndicator[activeChat?._id] &&
                  typeIndicator[activeChat._id].length > 0 && (
                    <div className="absolute bottom-0 text-sm ml-2 bg-[#202021] rounded-full rounded-tr-none px-2 py-1 z-10 font-semibold">
                      {typeIndicator[activeChat._id].map((user, index) => (
                        <span key={user._id}>
                          {user.firstName}{" "}
                          {index < typeIndicator[activeChat._id].length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                      {typeIndicator[activeChat._id].length > 1
                        ? " are typing..."
                        : " is typing..."}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <aside className="border-r-2 relative z-10 transition-all theme-bg h-screen overflow-y-hidden min-w-[21.5vw] flex flex-col items-center  sidepanel">
        <div className="sidepanel w-full">
          <header className="flex items-center justify-between w-full px-4">
            <div className=" self-start flex justify-between items-center py-2 h-[58px] gap-6">
              <button
                onClick={() => setViewChatInfo(false)}
                className="theme-hover-bg-2 cursor-pointer transition-all p-2 theme-text-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M20 20L4 4m16 0L4 20"
                  />
                </svg>
              </button>
              <h1 className="font-semibold text-xl">
                {otherUser ? "User" : "Group"} info
              </h1>
            </div>
            {activeChat?.type !== "private" && isAdmin && (
              <button
                onClick={() => setEditingChannel(true)}
                className="theme-hover-bg-2 cursor-pointer transition-all p-2 theme-text-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
                  />
                </svg>
              </button>
            )}
          </header>
          <div className="flex flex-col items-center mt-6 w-full">
            <ChatImage dimensions={30} />
            <p className="mt-4 font-semibold text-lg">{displayName}</p>
            <p className="theme-text-2">
              {activeChat?.type === "private" && (
                <p className="theme-text-2 text-sm">
                  {otherUser.lastSeen
                    ? `last seen ${getRecentTime(otherUser.lastSeen)}`
                    : "online"}
                </p>
              )}
              {activeChat?.type !== "private" &&
                `${activeChat.users?.length} member${
                  activeChat.users?.length > 1 ? "s" : ""
                }`}
            </p>
            <div className="flex flex-col w-full mt-8">
              {activeChat?.type === "private" && (
                <>
                  <div className="flex theme-hover-bg-2 p-2 rounded-lg transition-all cursor-pointer gap-4 items-center w-full px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="min-w-[10%] theme-text-2"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M15.6 8.4v4.5a2.7 2.7 0 1 0 5.4 0V12a9 9 0 1 0-3.6 7.2M15.6 12a3.6 3.6 0 1 1-7.2 0a3.6 3.6 0 0 1 7.2 0"
                        color="currentColor"
                      />
                    </svg>
                    <div className="flex flex-col max-w-[90%]">
                      <p>
                        {otherUser?.username
                          ? otherUser?.username
                          : `${otherUser?.firstName}, ${otherUser?.lastName[0]}`}
                      </p>
                      <span className="theme-text-2 text-sm">Username</span>
                    </div>
                  </div>
                  <div className="flex theme-hover-bg-2 p-2 rounded-lg transition-all cursor-pointer gap-4 items-center w-full px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="min-w-[10%] theme-text-2"
                    >
                      <path
                        fill="currentColor"
                        d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                      />
                    </svg>
                    <div className="flex flex-col max-w-[90%]">
                      <p>{otherUser?.bio ? otherUser.bio : "No bio given."}</p>
                      <span className="theme-text-2 text-sm">Bio</span>
                    </div>
                  </div>
                </>
              )}
              {activeChat?.type !== "private" && (
                <>
                  <div className="flex theme-hover-bg-2 p-2 rounded-lg transition-all cursor-pointer gap-4 items-center w-full px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="min-w-[10%] theme-text-2"
                    >
                      <path
                        fill="currentColor"
                        d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                      />
                    </svg>
                    <div className="flex flex-col max-w-[90%]">
                      <p>
                        {activeChat?.description
                          ? activeChat.description
                          : "No description given."}
                      </p>
                      <span className="theme-text-2 text-sm">Info</span>
                    </div>
                  </div>
                  <div className="flex theme-hover-bg-2 p-2 rounded-lg transition-all cursor-pointer gap-4 items-center w-full px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="min-w-[10%] theme-text-2"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m9.172 14.829l5.657-5.657M7.05 11.293l-1.414 1.414a4 4 0 1 0 5.657 5.657l1.412-1.414m-1.413-9.9l1.414-1.414a4 4 0 1 1 5.657 5.657l-1.414 1.414"
                      />
                    </svg>
                    <div
                      onClick={() =>
                        copyToClipboard(
                          `${import.meta.env.VITE_FRONT_PORT}/${
                            activeChat?._id
                          }`
                        )
                      }
                      className="flex flex-col max-w-[90%]"
                    >
                      <p className="max-w-[90%] truncate">
                        {import.meta.env.VITE_FRONT_PORT}/{activeChat?._id}
                      </p>
                      <span className="theme-text-2 text-sm">Link</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {activeChat?.type !== "private" && (
              <div className="w-full max-h-1/2">
                <header className="p-3 flex border-t-16 border-b-2 sidepanel w-full theme-text-2 font-semibold">
                  <p
                    onClick={() => setActiveSelect("members")}
                    className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
                      activeSelect !== "members"
                        ? "theme-text-2"
                        : "text-[#8675DC]"
                    }`}
                  >
                    Members
                  </p>
                  <p
                    onClick={() => setActiveSelect("admins")}
                    className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
                      activeSelect !== "admins"
                        ? "theme-text-2"
                        : "text-[#8675DC]"
                    }`}
                  >
                    Admins
                  </p>
                </header>
                <ul className="p-2 flex flex-col w-full overflow-y-auto max-h-[100%]">
                  {showUsers?.map((user) => {
                    const userIsAdmin = activeChat?.admins?.some(
                      (u) => u._id.toString() === user._id
                    );
                    return (
                      <li
                        key={user._id}
                        onClick={() => {
                          createDirectMessage({ userId: user._id });
                        }}
                        className="flex items-center gap-2 transition-all theme-hover-bg-2 p-2 rounded-lg cursor-pointer"
                      >
                        <img
                          src={`${user.imageUrl}`}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-10 w-10 rounded-full mt-1"
                        />
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <p className=" font-semibold">
                              {user.firstName}, {user.lastName[0]}
                            </p>
                            {userIsAdmin && (
                              <p className="theme-text-2 text-xs">admin</p>
                            )}
                          </div>
                          <p className="theme-text-2 text-sm">
                            {user.lastSeen
                              ? `last seen ${getRecentTime(user.lastSeen)}`
                              : "online"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
        {activeChat?.type !== "private" && (
          <div
            className={`w-full transition-all absolute ${
              editingChannel ? "left-0" : "left-full"
            }`}
          >
            <ModifyTab
              isModifying={editingChannel}
              setIsModifying={setEditingChannel}
              action={editChannel}
              title="Edit"
              type="edit"
              victimData={{
                imageUrl: activeChat?.imageUrl,
                name: activeChat?.name,
                description: activeChat?.description,
              }}
            />
          </div>
        )}
      </aside>
    </div>
  );
}
