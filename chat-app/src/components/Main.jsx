import Image from "../assets/tg-bg.png";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PopUpMenu from "./PopUpMenu";
import PopUpMenuItem from "./PopUpMenuItem";
import { closeModal, openModal } from "../store/modalSlice";
import Modal from "./Modal";
import { Button } from "@mui/material";
import { setActiveChat } from "../store/chatSlice";
import Aside from "./Aside";
import { setIsFocused } from "../store/searchSlice";
import MessagesList from "./MessagesList";
import { io } from "socket.io-client";
import Gradient from "../assets/gradient.png";
import cat from "../assets/undraw_cat_lqdj.svg";
import {
  setForwardedChat,
  setIsSelecting,
  setMessage,
  setMessageToEdit,
  setMessageType,
  setSelected,
} from "../store/messageSlice";
import AsideChat from "./AsideChat";
import { handlePostInput } from "../utility/util";
import Input from "./Input";

const socket = io("http://localhost:3000");

export default function Main() {
  const [value, setValue] = useState("");
  const [viewInfo, setViewInfo] = useState(false);
  const [activeSelect, setActiveSelect] = useState("members");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [deleteForAll, setDeleteForAll] = useState(false);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([""]);

  const { chatId } = useParams();

  const queryClient = useQueryClient();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const messagesListRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { activeChat, userChats } = useSelector((state) => state.chat);
  const { select } = useSelector((state) => state.search);
  const {
    message,
    messageType,
    forwardedChat,
    messageToEdit,
    isSelecting,
    selected,
  } = useSelector((state) => state.message);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (messageType === "reply" && message.chat._id !== activeChat._id) {
      dispatch(setMessageType("normal"));
      dispatch(setMessage(null));
    }
    if (messageToEdit) {
      setValue(messageToEdit.message);
    }
  }, [messageToEdit, activeChat, message, dispatch, messageType]);

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  useEffect(() => {
    if (!chatId) {
      dispatch(setActiveChat(null));
    }
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

  const handleGetMessages = async () => {
    const response = await fetch(
      "http://localhost:3000/message/get-messages/" + chatId,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await response.json();

    return data;
  };

  const { data: messages, msgIsLoading } = useQuery({
    queryFn: handleGetMessages,
    queryKey: ["messages", activeChat?._id],
    enabled: !!activeChat,
  });

  const handleDeleteMessage = async () => {
    try {
      let refIds = message._id;
      if (Array.isArray(message)) {
        refIds = message.map((m) => m._id);
      }
      const response = await fetch(
        "http://localhost:3000/message/delete-message",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            messageId: refIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Sending a message failed.");
      }

      queryClient.invalidateQueries(["messages", activeChat?._id]);
      queryClient.invalidateQueries(["search", select]);

      dispatch(setMessage(null));
      dispatch(setIsSelecting(false));
      dispatch(setSelected([]));
      messagesListRef.current?.scrollToBottom();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: deleteMessage } = useMutation({
    mutationFn: handleDeleteMessage,
  });

  const handleSendMessage = async () => {
    try {
      const formData = new FormData();

      formData.append("message", photoCaption ? photoCaption : value);
      formData.append("chatId", activeChat._id);
      formData.append("type", messageType);
      if (photoUrl) {
        formData.append("imageUrl", photoUrl);
      }

      if (Array.isArray(message)) {
        message.forEach((m, index) => {
          formData.append(`referenceMessageId[${index}]`, m._id);
        });
      } else if (message?._id) {
        formData.append("referenceMessageId", message._id);
      }

      const response = await fetch(
        "http://localhost:3000/message/send-message",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error("Sending a message failed.");
      }

      queryClient.invalidateQueries(["search", select]);

      setValue("");
      dispatch(setMessage(null));
      dispatch(setMessageType("normal"));
      setPhotoUrl(null);
      setPhotoPreview(null);
      setPhotoCaption("");
      messagesListRef.current?.scrollToBottom();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: handleSendMessage,
  });

  const handleEditMessage = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/message/edit-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            message: value,
            messageId: messageToEdit._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Sending a message failed.");
      }

      queryClient.invalidateQueries(["messages", activeChat?._id]);
      queryClient.invalidateQueries(["search", select]);

      setValue("");
      dispatch(setMessage(null));
      dispatch(setMessageType("normal"));
      dispatch(setMessageToEdit(null));

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: editMessage, isLoading: editIsPending } = useMutation({
    mutationFn: handleEditMessage,
  });

  const handleAddUserToChat = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/add-user/" + activeChat._id,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      dispatch(setActiveChat(data.data));
      dispatch(setIsFocused(false));

      console.log(data);

      if (!response.ok) {
        throw new Error("Couldn't add user to the chat.");
      }

      queryClient.invalidateQueries(["chats"]);

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: addUser, addUserIsPending } = useMutation({
    mutationFn: ({ userId }) => handleAddUserToChat(userId),
  });

  const handleRemoveUserFromChat = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/remove-user/" + activeChat._id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Couldn't remove user from the chat.");
      }

      queryClient.invalidateQueries(["chats"]);
      dispatch(setActiveChat(null));
      dispatch(closeModal());

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: removeUserFromChat, removeUserIsPending } = useMutation({
    mutationFn: ({ userId }) => handleRemoveUserFromChat(userId),
    onSuccess: () => dispatch(closeModal()),
  });

  const handleDeleteChat = async () => {
    try {
      const response = await fetch("http://localhost:3000/chat/delete-chat", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ chatId: activeChat._id }),
      });

      if (!response.ok) {
        throw new Error("Deleting the chat failed.");
      }

      queryClient.invalidateQueries(["chats"]);
      dispatch(setActiveChat(null));
      dispatch(closeModal());

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: deleteChat } = useMutation({
    mutationFn: handleDeleteChat,
  });

  const isAdmin = activeChat?.admins?.some(
    (u) => u._id.toString() === user._id
  );

  const isInChat = activeChat?.users?.some(
    (u) => u._id.toString() === user._id
  );

  const showUsers =
    activeSelect === "members" ? activeChat?.users : activeChat?.admins;

  const isReplying =
    messageType === "reply" && message.chat._id === activeChat._id;

  const isForwarding =
    messageType === "forward" && activeChat._id === forwardedChat?._id;

  const [pollSettings, setPollSettings] = useState({
    anon: false,
    multiple: false,
    quiz: false,
  });

  console.log(123);

  return (
    <main className="bg-[#202021] w-screen h-screen flex justify-center ">
      {activeChat && (
        <Modal id="leave-channel">
          <header className="flex items-center gap-5">
            {activeChat?.imageUrl ? (
              <img
                src={`http://localhost:3000/${activeChat.imageUrl}`}
                alt={activeChat.name}
                className="min-h-8 max-h-8 min-w-8 max-w-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-full text-xs grid place-items-center font-semibold text-white"
                style={{
                  background: `linear-gradient(${
                    activeChat?.gradient?.direction
                  }, ${activeChat?.gradient?.colors.join(", ")})`,
                }}
              >
                {activeChat?.name?.slice(0, 3)}
              </div>
            )}
            <p className="font-semibold text-xl">Delete channel</p>
          </header>
          <p className="mt-4 font-semibold">
            Do you want to delete and leave the <br /> channel?
          </p>
          {isAdmin && (
            <div className="checkbox-wrapper-4 w-full h-[4rem] flex items-center">
              <input
                onChange={() => setDeleteForAll(!deleteForAll)}
                className="inp-cbx"
                id="morning"
                type="checkbox"
              />
              <label
                className="cbx w-full h-full flex gap-8 items-center"
                htmlFor="morning"
              >
                <span>
                  <svg width="12px" height="10px">
                    <use xlinkHref="#check-4"></use>
                  </svg>
                </span>
                <span className="font-normal">Delete for all subscribers</span>
              </label>
              <svg className="inline-svg">
                <symbol id="check-4" viewBox="0 0 12 10">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </symbol>
              </svg>
            </div>
          )}
          <div className="flex">
            <Button
              onClick={() => dispatch(closeModal())}
              sx={{
                backgroundColor: "transparent",
                color: "#8675DC",
                padding: "16px",
                borderRadius: "12px",
                width: "40%",
              }}
              variant="contained"
            >
              CANCEL
            </Button>
            <Button
              onClick={() => {
                if (deleteForAll) {
                  deleteChat();
                } else removeUserFromChat({ userId: userId });
              }}
              sx={{
                backgroundColor: "transparent",
                color: "#f56565",
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
              }}
              variant="contained"
            >
              {removeUserIsPending ? "PLEASE WAIT..." : "DELETE CHANNEL"}
            </Button>
          </div>
        </Modal>
      )}
      <Modal extraClasses="w-[30rem]" id="forward-to-channels">
        <div className=" text-[#ccc] flex gap-4 items-center">
          <button
            onClick={() => {
              dispatch(closeModal());
              dispatch(setForwardedChat(null));
              dispatch(setMessageType("normal"));
              dispatch(setMessage(null));
            }}
            className="hover:bg-[#303030] cursor-pointer transition-all p-2 rounded-full"
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
          <h1 className="font-semibold text-xl">Forward to</h1>
        </div>
        {userChats?.length === 1 && (
          <div className="flex py-20 items-center justify-center flex-col gap-2 h-full w-ful">
            <img className="w-1/2" src={cat} alt="No chats available" />
            <p className="text-[#ccc] text-sm font-semibold">
              You are not in any chats yet
            </p>
            <p className="text-[#ccc] text-xs">
              Try searching for one or check out all the chats
            </p>
          </div>
        )}
        {userChats.map((chat) => {
          if (chat?._id === activeChat?._id) return;
          return (
            <AsideChat
              key={chat._id}
              action={() => {
                dispatch(setForwardedChat(chat));
                dispatch(closeModal());

                if (isSelecting) {
                  dispatch(setIsSelecting(false));
                  dispatch(setSelected([]));
                }
              }}
              chat={chat}
            />
          );
        })}
      </Modal>
      <Modal id="delete-message">
        <header className="flex items-center gap-5">
          {activeChat?.imageUrl ? (
            <img
              src={`http://localhost:3000/${activeChat.imageUrl}`}
              alt={activeChat.name}
              className="min-h-8 max-h-8 min-w-8 max-w-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="h-8 w-8 rounded-full text-xs grid place-items-center font-semibold text-white"
              style={{
                background: `linear-gradient(${
                  activeChat?.gradient?.direction
                }, ${activeChat?.gradient?.colors.join(", ")})`,
              }}
            >
              {activeChat?.name?.slice(0, 3)}
            </div>
          )}
          <p className="font-semibold text-xl">
            Delete {Array.isArray && message?.length} message
            {Array.isArray(message) && message.length > 1 && "s"}
          </p>
        </header>
        <p className="mt-4 font-semibold">
          Are you sure you want to delete{" "}
          {Array.isArray(message) ? "these" : "this"} <br /> message
          {Array.isArray(message) && message.length > 1 && "s"}{" "}
          {Array.isArray(message) && "for everyone"}?
        </p>

        <div className="flex items-center justify-end">
          <Button
            onClick={() => dispatch(closeModal())}
            sx={{
              backgroundColor: "transparent",
              color: "#8675DC",
              padding: "16px",
              borderRadius: "12px",
              width: "40%",
            }}
            variant="contained"
          >
            CANCEL
          </Button>
          <Button
            onClick={() => {
              deleteMessage();
              dispatch(closeModal());
            }}
            sx={{
              backgroundColor: "transparent",
              color: "#f56565",
              padding: "16px",
              borderRadius: "12px",
            }}
            variant="contained"
          >
            {removeUserIsPending ? "PLEASE WAIT..." : "DELETE"}
          </Button>
        </div>
      </Modal>
      <Modal id="send-photo">
        <header className="flex gap-10 items-center text-lg font-semibold">
          <button
            onClick={() => {
              setPhotoUrl(null);
              setPhotoPreview(null);
              setPhotoCaption("");
              dispatch(closeModal());
            }}
            className="hover:bg-[#303030] cursor-pointer transition-all p-2 rounded-full"
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
          <h1>Send Photo</h1>
        </header>
        {photoPreview && (
          <img
            className="max-w-[20rem] mx-auto max-h-[20rem] my-4"
            src={photoPreview}
          />
        )}

        <div className="flex gap-4">
          <input
            onChange={(e) => setPhotoCaption(e.target.value)}
            value={photoCaption}
            className="focus:outline-none py-2 w-full"
            placeholder="Add a caption..."
          />
          <Button
            onClick={async () => {
              await sendMessage();
              dispatch(closeModal());
            }}
            sx={{
              backgroundColor: "#8675DC",
              padding: "4px",
              borderRadius: "12px",
              width: "30%",
            }}
            variant="contained"
          >
            SEND
          </Button>
        </div>
      </Modal>
      <Modal
        extraClasses="max-h-[40rem] overflow-auto w-[30rem] py-8"
        id="send-poll"
      >
        <header className="flex justify-between items-center text-lg font-semibold">
          <div className="flex gap-10 items-center">
            <button
              onClick={() => {
                dispatch(closeModal());
              }}
              className="hover:bg-[#303030] cursor-pointer transition-all p-2 rounded-full"
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
            <h1>New Poll</h1>
          </div>

          <Button
            disabled={
              !pollQuestion ||
              pollOptions.filter((opt) => opt.trim() !== "").length < 2
            }
            onClick={async () => {
              await sendMessage();
              dispatch(closeModal());
            }}
            sx={{
              backgroundColor: "#8675DC",
              padding: "4px",
              borderRadius: "8px",
              width: "30%",
            }}
            variant="contained"
          >
            CREATE
          </Button>
        </header>
        <Input
          onChange={(e) => setPollQuestion(e.target.value)}
          textClass="bg-[#151515]"
        >
          Ask a Question
        </Input>
        <h1 className="my-4 font-bold  text-[#ccc]">Poll options</h1>
        {pollOptions.map((opt, index) => (
          <Input
            inputValue={opt}
            value={opt}
            onChange={(e) => {
              setPollOptions((prevPollOptions) => {
                const newOptions = [...prevPollOptions];
                newOptions[index] = e.target.value;

                if (
                  index === newOptions.length - 1 &&
                  e.target.value.trim() !== ""
                ) {
                  if (newOptions.length === 10) return newOptions;
                  newOptions.push("");
                }

                return newOptions;
              });
            }}
            key={index}
            textClass="bg-[#151515]"
          >
            Add an Option
          </Input>
        ))}

        <h1 className="my-4 font-bold  text-[#ccc]">Settings</h1>
        <div className="flex flex-col gap-4">
          <div className="cb4 flex">
            <input
              onClick={() =>
                setPollSettings({
                  ...pollSettings,
                  anon: true,
                })
              }
              checked={pollSettings.anon}
              className="inp-cbx"
              id="anonymous-voting"
              type="checkbox"
            />
            <label className="cbx" htmlFor="anonymous-voting">
              <span>
                <svg width="12px" height="10px">
                  <use xlinkHref="#check-4"></use>
                </svg>
              </span>
              <span className="ml-4">Anonymous Voting</span>
            </label>
            <svg className="inline-svg">
              <symbol id="check-4" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </symbol>
            </svg>
          </div>
          <div className="cb4 flex">
            <input
              onClick={() =>
                setPollSettings({
                  ...pollSettings,
                  multiple: true,
                  quiz: false,
                })
              }
              checked={pollSettings.multiple}
              className="inp-cbx"
              id="multiple-answers"
              type="checkbox"
            />
            <label className="cbx" htmlFor="multiple-answers">
              <span>
                <svg width="12px" height="10px">
                  <use xlinkHref="#check-4"></use>
                </svg>
              </span>
              <span className="ml-4">Multiple Answers</span>
            </label>
            <svg className="inline-svg">
              <symbol id="check-4" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </symbol>
            </svg>
          </div>
          <div className="cb4 flex">
            <input
              onClick={() =>
                setPollSettings({
                  ...pollSettings,
                  quiz: true,
                  multiple: false,
                })
              }
              checked={pollSettings.quiz}
              className="inp-cbx"
              id="quiz-mode"
              type="checkbox"
            />
            <label className="cbx" htmlFor="quiz-mode">
              <span>
                <svg width="12px" height="10px">
                  <use xlinkHref="#check-4"></use>
                </svg>
              </span>
              <span className="ml-4">Quiz Mode</span>
            </label>
            <svg className="inline-svg">
              <symbol id="check-4" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </symbol>
            </svg>
          </div>
        </div>
      </Modal>
      <div className="w-[85vw] flex justify-between overflow-hidden">
        <Aside />
        <div
          className={`relative w-[63.5vw] transition-all ${
            viewInfo ? "mr-[21.5vw]" : "mr-0"
          }`}
        >
          <img
            className={`min-w-[63.5vw] absolute z-10 pointer-events-none h-full left-0 top-0 object-cover`}
            src={Image}
          />
          <img
            className="min-w-[63.5vw] absolute z-0 h-screen"
            src={Gradient}
          />
          <div className="absolute min-w-[63.5vw] h-screen z-10 bg-[#00000090]"></div>
          <div
            className={`transition-all ${viewInfo ? "w-[42vw]" : "w-[63.5vw]"}`}
          >
            {activeChat && (
              <div className="relative h-screen w-full text-white flex flex-col items-center">
                <header
                  onClick={() => setViewInfo(true)}
                  className="relative z-210 border-x-2 border-[#151515] bg-[#252525] w-full px-5 py-2 flex justify-between items-center gap-5 h-[5%] cursor-pointer"
                >
                  <div className="flex gap-5 items-center">
                    {activeChat?.imageUrl ? (
                      <img
                        src={`http://localhost:3000/${activeChat.imageUrl}`}
                        alt={activeChat.name}
                        className="min-h-10 max-h-10 min-w-10 max-w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-10 w-10 rounded-full text-xs grid place-items-center font-semibold text-white"
                        style={{
                          background: `linear-gradient(${
                            activeChat?.gradient.direction
                          }, ${activeChat?.gradient.colors.join(", ")})`,
                        }}
                      >
                        {activeChat?.name.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{activeChat.name}</p>
                      <p className="text-[#ccc] text-sm -mt-1">
                        {activeChat.users.length} member
                        {activeChat.users.length > 1 && "s"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-20">
                    {activeChat.pinnedMessage && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm border-l-2 border-[#8675DC] px-4"
                      >
                        <p className="text-[#8675DC]">Pinned Message</p>
                        <div className="flex gap-2">
                          <p>{activeChat.pinnedMessage.sender.firstName}: </p>
                          <p className="line-clamp-1 max-w-[10rem] truncate whitespace-nowrap overflow-hidden">
                            {activeChat.pinnedMessage.message
                              ? activeChat.pinnedMessage.message
                              : activeChat.pinnedMessage.referenceMessageId
                                  .message}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeChat.type !== "saved" && (
                      <PopUpMenu
                        bl={true}
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M12 5.92A.96.96 0 1 0 12 4a.96.96 0 0 0 0 1.92m0 7.04a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92M12 20a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92"
                            />
                          </svg>
                        }
                        buttonClasses={
                          "hover:bg-[#303030] cursor-pointer transition-all p-2 text-white rounded-full"
                        }
                      >
                        {" "}
                        {isSelecting && (
                          <PopUpMenuItem
                            action={(e) => {
                              e.stopPropagation();
                              dispatch(setSelected([]));
                              dispatch(setIsSelecting(false));
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                              />
                            </svg>
                            <p className="font-semibold flex-shrink-0">
                              Clear selection
                            </p>
                          </PopUpMenuItem>
                        )}
                        {!isSelecting && (
                          <PopUpMenuItem
                            action={(e) => {
                              e.stopPropagation();
                              dispatch(setIsSelecting(true));
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill="currentColor"
                                d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M6.7 9.29L9 11.6l4.3-4.3l1.4 1.42L9 14.4l-3.7-3.7l1.4-1.42z"
                              />
                            </svg>
                            <p className="font-semibold flex-shrink-0">
                              Select Messages
                            </p>
                          </PopUpMenuItem>
                        )}
                        {isInChat && (
                          <PopUpMenuItem
                            itemClasses={"text-red-500 hover:bg-red-500/20"}
                            action={(e) => {
                              e.stopPropagation();
                              dispatch(openModal("leave-channel"));
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"
                              />
                            </svg>
                            <p className="font-semibold flex-shrink-0">
                              {isAdmin ? "Delete Channel" : "Leave Channel"}
                            </p>
                          </PopUpMenuItem>
                        )}
                      </PopUpMenu>
                    )}
                  </div>
                </header>
                <div
                  className={`flex flex-col justify-end gap-2 transition-all h-[92%] w-full`}
                >
                  <div className="flex flex-col w-full items-center justify-end max-h-[100%]">
                    <ul
                      className={`transition-all flex h-full ${
                        viewInfo ? "w-[80%]" : "w-[55%]"
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
                          viewInfo={viewInfo}
                          ref={messagesListRef}
                          messages={messages}
                          setShowScrollButton={setShowScrollButton}
                        />
                      )}
                      <div
                        className={`relative z-10 flex justify-between gap-2 w-full`}
                      >
                        {isSelecting && (
                          <div
                            className={`${
                              !isInChat && "jumpInAnimation"
                            } absolute left-1/2 -translate-x-1/2  bg-[#252525] flex gap-4 px-4 py-2 h-full rounded-2xl z-10 items-center w-[70%] justify-between`}
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
                                  className="text-[#ccc]"
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
                                  !selected.length &&
                                  "opacity-50 pointer-events-none"
                                } flex w-full py-2  px-2 items-center gap-4 rounded-md  hover:bg-[#303030] transition-all cursor-pointer`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 32 32"
                                  className="text-[#ccc] -scale-x-100"
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
                                    selected.some(
                                      (s) => s.sender._id !== user._id
                                    ))
                                }
                                onClick={() => {
                                  dispatch(openModal("delete-message"));
                                  dispatch(setMessage(selected));
                                }}
                                className={`${
                                  !isInChat ||
                                  !selected.length ||
                                  (!isAdmin &&
                                    selected.some(
                                      (s) => s.sender._id !== user._id
                                    ))
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
                        {isInChat && (
                          <>
                            {!isSelecting && (
                              <>
                                {isReplying && (
                                  <div className="ml-[6px] interactInputAnimation absolute bg-[#252525] flex gap-4 px-4 py-2 left-0 w-[89%] z-10 h-full rounded-2xl items-center rounded-b-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 32 32"
                                      className="text-[#8675DC]"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16 16 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"
                                      />
                                    </svg>
                                    <div className="bg-[#8675DC20] w-full px-2 text-sm rounded-md border-l-4 border-[#8675DC]">
                                      <p className="text-[#8675DC]">
                                        Reply to {message.sender.firstName}{" "}
                                        {message.sender.lastName}
                                      </p>
                                      <p className="text-[#ccc] line-clamp-1">
                                        {message.referenceMessageId
                                          ? message.referenceMessageId.message
                                          : message.message}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        dispatch(setMessage(null));
                                        dispatch(setMessageType("normal"));
                                        dispatch(setForwardedChat(null));
                                      }}
                                      className="hover:bg-[#8675DC20] cursor-pointer transition-all p-2 text-[#8675DC] rounded-full"
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
                                  </div>
                                )}
                                {isForwarding && forwardedChat && (
                                  <div className="ml-[6px] interactInputAnimation absolute bg-[#252525] flex gap-4 px-4 py-2 left-0 w-[89%] z-10 h-full rounded-2xl items-center rounded-b-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 32 32"
                                      className="text-[#8675DC] -scale-x-100"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16 16 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"
                                      />
                                    </svg>
                                    <div className="bg-[#8675DC20] w-full px-2 text-sm rounded-md border-l-4 border-[#8675DC]">
                                      <p className="text-[#8675DC]">
                                        {Array.isArray(message)
                                          ? `Forwarded ${message.length} Messages`
                                          : "Forwarded Message"}
                                      </p>
                                      <p className="text-[#ccc] line-clamp-1">
                                        {Array.isArray(message)
                                          ? `From ${
                                              message[0]?.sender.firstName
                                            } ${
                                              message.length > 1
                                                ? "and others"
                                                : ""
                                            }`
                                          : `${message?.sender.firstName} 
                                    ${message?.sender.lastName}: `}
                                        {message?.message}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        dispatch(setMessage(null));
                                        dispatch(setMessageType("normal"));
                                      }}
                                      className="hover:bg-[#8675DC20] cursor-pointer transition-all p-2 text-[#8675DC] rounded-full"
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
                                  </div>
                                )}
                                {messageToEdit && (
                                  <div className="ml-[6px] interactInputAnimation z-10 absolute bg-[#252525] flex gap-4 px-4 py-2 left-0 w-[89%] h-full rounded-2xl items-center rounded-b-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      className="text-[#8675DC]"
                                    >
                                      <rect
                                        width="24"
                                        height="24"
                                        fill="none"
                                      />
                                      <path
                                        fill="currentColor"
                                        d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
                                      />
                                    </svg>
                                    <div className="bg-[#8675DC20] w-full px-2 text-sm rounded-md border-l-4 border-[#8675DC]">
                                      <p className="text-[#8675DC]">Editing</p>
                                      <p className="text-[#ccc] line-clamp-1">
                                        {messageToEdit?.message}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        dispatch(setMessage(null));
                                        dispatch(setMessageType("normal"));
                                        dispatch(setMessageToEdit(null));
                                        setValue("");
                                      }}
                                      className="hover:bg-[#8675DC20] cursor-pointer transition-all p-2 text-[#8675DC] rounded-full"
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
                                  </div>
                                )}
                              </>
                            )}

                            <input
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              placeholder={!isSelecting && "Broadcast"}
                              className={`bg-[#252525] transition-all duration-300 ease-in-out relative focus:outline-none py-2 rounded-2xl px-4
                              ${isSelecting ? "w-[70%]" : "w-[89%]"} mx-auto`}
                            />

                            {showScrollButton && (
                              <button
                                onClick={() =>
                                  messagesListRef.current?.scrollToBottom()
                                }
                                className={`appearAnimation absolute right-0 bottom-[120%] p-4 rounded-full bg-[#202021] hover:bg-[#303030] transition-all cursor-pointer`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16z"
                                  />
                                </svg>
                              </button>
                            )}
                            <div className="absolute z-50 right-20 top-1/2 -translate-y-1/2">
                              <PopUpMenu
                                tl={true}
                                icon={
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                  >
                                    <rect width="20" height="20" fill="none" />
                                    <path
                                      fill="currentColor"
                                      d="M3.264 8.579a.683.683 0 0 1-.975 0a.704.704 0 0 1 0-.987L8.32 1.5C9.68.444 11.048-.063 12.41.006c1.716.088 3.052.742 4.186 1.815C17.752 2.915 18.5 4.476 18.5 6.368c0 1.452-.422 2.73-1.313 3.864l-8.503 8.76c-.86.705-1.816 1.046-2.84 1.005c-1.3-.054-2.267-.474-2.986-1.185c-.842-.831-1.358-1.852-1.358-3.225c0-1.092.377-2.1 1.155-3.046L10.139 4.9c.6-.64 1.187-1.02 1.787-1.112a2.49 2.49 0 0 1 2.2.755c.532.563.76 1.265.68 2.064c-.055.545-.278 1.047-.688 1.528l-6.88 7.048a.683.683 0 0 1-.974.006a.704.704 0 0 1-.006-.987l6.847-7.012c.2-.235.305-.472.33-.724c.04-.4-.056-.695-.305-.958a1.12 1.12 0 0 0-1-.34c-.243.037-.583.258-1.002.704l-7.453 7.607c-.537.655-.797 1.35-.797 2.109c0 .954.345 1.637.942 2.226c.475.47 1.12.75 2.08.79c.68.027 1.31-.198 1.858-.642l8.397-8.65c.645-.827.967-1.8.967-2.943c0-1.482-.577-2.684-1.468-3.528c-.91-.862-1.95-1.37-3.313-1.44c-1.008-.052-2.065.34-3.117 1.146z"
                                    />
                                  </svg>
                                }
                                buttonClasses="cursor-pointer z-10 text-[#ccc] p-2 rounded-full hover:bg-[#404040]"
                              >
                                <PopUpMenuItem itemClasses="w-[10rem] cursor-pointer">
                                  <input
                                    onChange={async (e) => {
                                      if (
                                        !e.target.files ||
                                        e.target.files.length === 0
                                      ) {
                                        console.log(
                                          "User canceled image selection."
                                        );
                                        setPhotoCaption("");
                                        setPhotoUrl(null);
                                        setPhotoPreview(null);
                                        return;
                                      }

                                      await handlePostInput(
                                        e.target.value,
                                        e.target.files,
                                        setPhotoPreview,
                                        setPhotoUrl
                                      );

                                      dispatch(openModal("send-photo"));
                                    }}
                                    className="opacity-0 absolute left-0 cursor-pointer"
                                    type="file"
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect width="24" height="24" fill="none" />
                                    <path
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6.5a1 1 0 0 1-.032.25A1 1 0 0 1 22 12v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3a1 1 0 0 1 .032-.25A1 1 0 0 1 2 15.5zm2.994 9.83q-.522.01-.994.046V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6.016c-4.297.139-7.4 1.174-9.58 2.623c.826.293 1.75.71 2.656 1.256c1.399.84 2.821 2.02 3.778 3.583a1 1 0 1 1-1.706 1.044c-.736-1.203-1.878-2.178-3.102-2.913c-1.222-.734-2.465-1.192-3.327-1.392a15.5 15.5 0 0 0-3.703-.386h-.022zm1.984-8.342A2.67 2.67 0 0 1 8.5 6c.41 0 1.003.115 1.522.488c.57.41.978 1.086.978 2.012s-.408 1.601-.978 2.011A2.67 2.67 0 0 1 8.5 11c-.41 0-1.003-.115-1.522-.489C6.408 10.101 6 9.427 6 8.5c0-.926.408-1.601.978-2.012"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <p className="font-semibold flex-shrink-0 cursor-pointer">
                                    Photo
                                  </p>
                                </PopUpMenuItem>
                                <PopUpMenuItem
                                  action={() =>
                                    dispatch(openModal("send-poll"))
                                  }
                                  itemClasses="w-[10rem]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect width="24" height="24" fill="none" />
                                    <path
                                      fill="currentColor"
                                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
                                    />
                                  </svg>
                                  <p className="font-semibold flex-shrink-0">
                                    Poll
                                  </p>
                                </PopUpMenuItem>
                              </PopUpMenu>
                            </div>
                            <button
                              onClick={() => {
                                if (!messageToEdit) {
                                  if (
                                    messageType === "forward" ||
                                    message !== ""
                                  ) {
                                    sendMessage();
                                  } else {
                                    console.log("Voice message.");
                                  }
                                } else {
                                  editMessage();
                                }
                              }}
                              className={`${
                                isSelecting && "scale-0"
                              } p-4 rounded-full bg-[#8675DC] hover:bg-[#8765DC] transition-all cursor-pointer`}
                            >
                              {value === "" && !isForwarding && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5z"
                                  />
                                </svg>
                              )}
                              {!isPending &&
                                !editIsPending &&
                                (value !== "" || isForwarding) && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M21.243 12.437a.5.5 0 0 0 0-.874l-2.282-1.268A75.5 75.5 0 0 0 4.813 4.231l-.665-.208A.5.5 0 0 0 3.5 4.5v5.75a.5.5 0 0 0 .474.5l1.01.053a44.4 44.4 0 0 1 7.314.998l.238.053c.053.011.076.033.089.05a.16.16 0 0 1 .029.096c0 .04-.013.074-.029.096c-.013.017-.036.039-.089.05l-.238.053a44.5 44.5 0 0 1-7.315.999l-1.01.053a.5.5 0 0 0-.473.499v5.75a.5.5 0 0 0 .65.477l.664-.208a75.5 75.5 0 0 0 14.147-6.064z"
                                    />
                                  </svg>
                                )}
                              {(isPending || editIsPending) && (
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
                              )}
                            </button>
                          </>
                        )}
                        {!isInChat && (
                          <div
                            className={`w-full transition-all grid place-items-center ${
                              viewInfo ? "mr-0" : "mr-16"
                            }`}
                          >
                            <Button
                              onClick={() => addUser({ userId: userId })}
                              sx={{
                                backgroundColor: "#202021",
                                color: "white",
                                padding: "16px",
                                borderRadius: "12px",
                                width: "20%",
                              }}
                              variant="contained"
                            >
                              {addUserIsPending ? "PLEASE WAIT..." : "JOIN"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <aside
          className={`border-r-2 transition-all bg-[#252525] h-screen overflow-y-hidden border-[#151515] min-w-[21.5vw] z-10 relative flex flex-col items-center text-white ${
            viewInfo ? "right-[21.5vw]" : "right-0"
          }`}
        >
          <header className="flex items-center justify-between w-full px-4">
            <div className="text-white self-start flex justify-between items-center py-2 h-[58px] gap-6">
              <button
                onClick={() => setViewInfo(false)}
                className="hover:bg-[#303030] cursor-pointer transition-all p-2 text-[#ccc] rounded-full"
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
              <h1 className="font-semibold text-xl">Group info</h1>
            </div>
            {isAdmin && (
              <button
                onClick={() => setViewInfo(false)}
                className="hover:bg-[#303030] cursor-pointer transition-all p-2 text-[#ccc] rounded-full"
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
          <div className="mx-2 flex flex-col items-center mt-6 w-full">
            {activeChat?.imageUrl ? (
              <img
                src={`http://localhost:3000/${activeChat.imageUrl}`}
                alt={activeChat.name}
                className="min-h-28 max-h-28 min-w-28 max-w-28 rounded-full object-cover"
              />
            ) : (
              <div
                className="h-28 w-28 rounded-full text-2xl grid place-items-center font-semibold text-white"
                style={{
                  background: `linear-gradient(${
                    activeChat?.gradient.direction
                  }, ${activeChat?.gradient.colors.join(", ")})`,
                }}
              >
                {activeChat?.name.slice(0, 3)}
              </div>
            )}
            <p className="mx-2 mt-4 font-semibold text-lg">
              {activeChat?.name}
            </p>
            <p className="mx-2 text-[#ccc]">
              {activeChat?.users?.length} member
              {activeChat?.users?.length > 1 && "s"}
            </p>
            <div className="mx-2 flex flex-col w-full mt-8">
              <div className="flex hover:bg-[#303030] p-2 rounded-lg transition-all cursor-pointer gap-2 items-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="min-w-[10%] text-[#ccc]"
                >
                  <path
                    fill="currentColor"
                    d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                  />
                </svg>
                <div className="flex flex-col max-w-[90%]">
                  <p>
                    {activeChat?.description
                      ? activeChat?.description
                      : "No description given."}
                  </p>
                  <span className="text-[#ccc] text-sm mt-2">Info</span>
                </div>
              </div>
              <div className="flex hover:bg-[#303030] p-2 rounded-lg transition-all cursor-pointer gap-2 items-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="min-w-[10%] text-[#ccc]"
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
                <div className="flex flex-col">
                  <p className="max-w-[90%] overflow-clip truncate">
                    http://localhost:5173/
                    {activeChat?._id}
                  </p>
                  <span className="text-[#ccc] text-sm mt-2">Link</span>
                </div>
              </div>
            </div>
            <div className="w-full max-h-1/2">
              <header className="p-3 flex border-t-16 border-b-2 border-b-[#151515] border-[#202021] w-full text-[#ccc] font-semibold">
                <p
                  onClick={() => setActiveSelect("members")}
                  className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
                    activeSelect !== "members"
                      ? "text-[#ccc]"
                      : "text-[#8675DC]"
                  }`}
                >
                  Members
                </p>
                <p
                  onClick={() => setActiveSelect("admins")}
                  className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
                    activeSelect !== "admins" ? "text-[#ccc]" : "text-[#8675DC]"
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
                      className="flex items-center gap-2 transition-all hover:bg-[#303030] p-2 rounded-lg cursor-pointer"
                    >
                      <img
                        src={`http://localhost:3000/${user.imageUrl}`}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-10 w-10 rounded-full mt-1"
                      />
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <p className="text-white font-semibold">
                            {user.firstName}, {user.lastName[0]}
                          </p>
                          {userIsAdmin && (
                            <p className="text-[#ccc] text-xs">admin</p>
                          )}
                        </div>
                        <p className="text-[#ccc] text-sm">
                          Last seen recently
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
