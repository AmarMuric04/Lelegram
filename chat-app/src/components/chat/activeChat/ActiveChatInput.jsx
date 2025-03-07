import { Button } from "@mui/material";
import {
  ArrowUpSVG,
  ClipSVG,
  EditSVG,
  ForwardSVG,
  PhotoSVG,
  PollSVG,
  ReplySVG,
  SendSVG,
  ThrobberSVG,
} from "../../../../public/svgs";
import { resetMessage, setValue } from "../../../store/redux/messageSlice";
import { openModal } from "../../../store/redux/modalSlice";
import { handlePostInput } from "../../../utility/util";
import ActionButton from "../../button/ActionButton";
import SpecialMessage from "../../message/SpecialMessage";
import PopUpMenu from "../../misc/PopUpMenu";
import PopUpMenuItem from "../../misc/PopUpMenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useMessageContext } from "../../../store/context/MessageProvider";
import { setActiveChat } from "../../../store/redux/chatSlice";
import { setIsFocused } from "../../../store/redux/searchSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { protectedPostData } from "../../../utility/async";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { io } from "socket.io-client";
import VoiceRecorder from "../../misc/VoiceRecorder";

const socket = io(import.meta.env.VITE_SERVER_PORT);
export default function ActiveChatInput({ showScrollButton, viewChatInfo }) {
  const {
    value,
    messageType,
    message,
    isSelecting,
    forwardedChat,
    messageToEdit,
  } = useSelector((state) => state.message);
  const { activeChat } = useSelector((state) => state.chat);
  const { sendMessage, isSendingMessage } = useMessageContext();
  const [showPicker, setShowPicker] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { sendMessageBy } = useSelector((state) => state.userSettings);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();
  const messagesListRef = useRef(null);

  const typingTimeout = useRef(null);
  const textareaRef = useRef(null);

  const isAdmin = activeChat?.admins?.some(
    (u) => u._id.toString() === user._id
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const insertAtCaret = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updatedValue =
      value.substring(0, start) + textToInsert + value.substring(end);

    dispatch(setValue(updatedValue));

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + textToInsert.length;
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertAtCaret("\t");
      return;
    }

    if (e.key === "Enter") {
      if (activeChat._id === "broadcast" && !isAdmin) return;
      if (sendMessageBy === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          if (value.trim()) {
            handleSendMessage({ value: value.trim() });
            dispatch(setValue(""));
          }
        }
      } else {
        if (e.ctrlKey) {
          e.preventDefault();
          if (value.trim()) {
            handleSendMessage({ value: value.trim() });
            dispatch(setValue(""));
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleTyping = () => {
      socket.emit("userTyping", { user, chatId: activeChat._id });

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      typingTimeout.current = setTimeout(() => {
        socket.emit("stopTyping", { user, chatId: activeChat._id });
      }, 2000);
    };

    if (value) {
      handleTyping();
    }
  }, [value, activeChat, user]);

  const { mutate: editMessage, isLoading: isEditPending } = useMutation({
    mutationFn: () => {
      const body = {
        message: value,
        messageId: messageToEdit._id,
      };
      return protectedPostData("/message/edit-message", body, token);
    },
    onSuccess: () => dispatch(resetMessage()),
  });

  const { mutate: addUser, isLoading: isAddUserPending } = useMutation({
    mutationFn: ({ userId }) =>
      protectedPostData(`/chat/add-user/${activeChat._id}`, { userId }, token),
    onSuccess: (data) => {
      dispatch(setActiveChat(data.data));
      dispatch(setIsFocused(false));
      queryClient.invalidateQueries(["chats"]);
    },
  });

  const handlePickImage = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      dispatch(resetMessage());
      return;
    }

    await handlePostInput(e.target.value, e.target.files, dispatch);

    dispatch(openModal("send-photo"));
  };

  const handleSendMessage = () => {
    if (!messageToEdit) {
      if (messageType === "forward" || message !== "") {
        sendMessage({ value: value.trim() });
      }
    } else {
      editMessage();
    }
    clearTimeout(typingTimeout);
    socket.emit("stopTyping", { user, chatId: activeChat._id });
  };

  const handleEmojiSelect = (emoji) => {
    dispatch(setValue(value + emoji.native));
    setShowPicker(false);
  };

  const isReplying =
    messageType === "reply" && message.chat._id === activeChat._id;

  const isForwarding =
    messageType === "forward" && activeChat._id === forwardedChat?._id;

  const isInChat = activeChat?.users?.some(
    (u) => u._id.toString() === user._id
  );

  const isInputInvalid = value === "" && !isForwarding;

  const isInputValid =
    !isSendingMessage && !isEditPending && (value !== "" || isForwarding);

  const isLoading = isSendingMessage || isEditPending;

  return (
    <>
      {isInChat && !isSelecting && (
        <>
          {isReplying && (
            <SpecialMessage
              icon={<ReplySVG classes="text-[#8675DC]" />}
              message={message}
              topMessage={`Reply to ${message.sender?.firstName + " "} ${
                message.sender?.lastName
              }`}
            />
          )}
          {isForwarding && forwardedChat && (
            <SpecialMessage
              icon={<ForwardSVG classes="text-[#8675DC]" />}
              message={message}
              topMessage={
                Array.isArray(message)
                  ? `Forwarded ${message.length} Messages`
                  : "Forwarded Message"
              }
            />
          )}
          {messageToEdit && (
            <SpecialMessage
              icon={<EditSVG classes="text-[#8675DC]" />}
              message={messageToEdit}
              topMessage={messageToEdit?.message}
            />
          )}
          <div
            className={`absolute transition-all bottom-[110%] right-20 z-10 ${
              showPicker ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          >
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
          <button
            className={`${
              isSelecting && "opacity-0 scale-0"
            } cursor-pointer p-2 rounded-full theme-hover-bg-2 transition-all theme-text-2 absolute z-10 right-30 top-1/2 -translate-y-1/2`}
            onClick={() => setShowPicker(!showPicker)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <rect width="24" height="24" fill="none" />
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10" />
                <path d="M16.5 14.5s-1.5 2-4.5 2s-4.5-2-4.5-2" />
                <path
                  fill="currentColor"
                  d="M15.5 9a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1m-7 0a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1"
                />
              </g>
            </svg>
          </button>
          <textarea
            disabled={activeChat?.type === "broadcast" && !isAdmin}
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (value.length === 4096) return;
              dispatch(setValue(e.target.value));
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              !isSelecting &&
              (activeChat.type === "broadcast" ? "Broadcast" : "Message")
            }
            rows={1}
            className={`pr-24 min-h-[2.5rem] theme-bg max-h-[40rem] transition-all ease-in-out relative focus:outline-none p-4 rounded-2xl rounded-br-none px-4 resize-none overflow-hidden mx-auto ${
              isSelecting ? "w-[70%]" : "w-[89%]"
            }`}
            style={{ height: "auto" }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 2048 2048"
            className="absolute -bottom-0 right-16"
          >
            <rect width="2048" height="2048" fill="none" />
            <path className="theme-fill-bg" d="m1024 0l1024 2048H0z" />
          </svg>
          {showScrollButton && (
            <button
              onClick={() => messagesListRef.current?.scrollToBottom()}
              className={`appearAnimation absolute right-0 bottom-[120%] p-4 rounded-full theme-bg theme-hover-bg-2 transition-all cursor-pointer`}
            >
              <ArrowUpSVG />
            </button>
          )}
          <div
            className={`${
              isSelecting && "opacity-0 scale-0"
            } transition-all absolute z-10 right-20 top-1/2 -translate-y-1/2`}
          >
            <PopUpMenu
              tl={true}
              icon={<ClipSVG />}
              buttonClasses="cursor-pointer z-10 theme-text-2 p-2 rounded-full theme-hover-bg-2"
            >
              <PopUpMenuItem itemClasses="w-[10rem] cursor-pointer">
                <input
                  className="opacity-0 absolute left-0 cursor-pointer"
                  type="file"
                  onChange={handlePickImage}
                />
                <PhotoSVG />
                <p className="font-semibold flex-shrink-0 cursor-pointer">
                  Photo
                </p>
              </PopUpMenuItem>
              <PopUpMenuItem
                action={() => dispatch(openModal("send-poll"))}
                itemClasses="w-[10rem]"
              >
                <PollSVG />
                <p className="font-semibold flex-shrink-0">Poll</p>
              </PopUpMenuItem>
            </PopUpMenu>
          </div>

          {isInputInvalid && (
            <VoiceRecorder
              disabled={activeChat?.type === "broadcast" && !isAdmin}
            />
          )}
          {isInputValid && (
            <ActionButton
              disabled={activeChat?.type === "broadcast" && !isAdmin}
              action={handleSendMessage}
            >
              {isInputValid && <SendSVG />}
              {isLoading && <ThrobberSVG />}
            </ActionButton>
          )}
        </>
      )}
      {!isInChat && (
        <div
          className={`w-full transition-all grid place-items-center ${
            viewChatInfo ? "mr-0" : "mr-16"
          }`}
        >
          <Button
            onClick={() => addUser({ userId })}
            sx={{
              backgroundColor: "#202021",
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              width: "20%",
            }}
            variant="contained"
          >
            {isAddUserPending ? "JOINING..." : "JOIN"}
          </Button>
        </div>
      )}
    </>
  );
}

ActiveChatInput.propTypes = {
  showScrollButton: PropTypes.bool.isRequired,
  viewChatInfo: PropTypes.bool.isRequired,
  setTypeIndicator: PropTypes.func,
};
