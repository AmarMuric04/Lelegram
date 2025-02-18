import { Button } from "@mui/material";
import {
  ArrowUpSVG,
  ClipSVG,
  EditSVG,
  ForwardSVG,
  MicrophoneSVG,
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
import PopUpMenu from "../../PopUpMenu";
import PopUpMenuItem from "../../PopUpMenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useMessageContext } from "../../../store/context/MessageProvider";
import { setActiveChat } from "../../../store/redux/chatSlice";
import { setIsFocused } from "../../../store/redux/searchSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import PropTypes from "prop-types";

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
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();

  const messagesListRef = useRef(null);

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

      dispatch(resetMessage());

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

  const isReplying =
    messageType === "reply" && message.chat._id === activeChat._id;

  const isForwarding =
    messageType === "forward" && activeChat._id === forwardedChat?._id;

  const isInChat = activeChat?.users?.some(
    (u) => u._id.toString() === user._id
  );

  return (
    <>
      {isInChat && !isSelecting && (
        <>
          {isReplying && (
            <SpecialMessage
              icon={<ReplySVG />}
              message={message}
              topMessage={`Reply to ${message.sender.firstName + " "} ${
                message.sender.lastName
              }`}
            />
          )}
          {isForwarding && forwardedChat && (
            <SpecialMessage
              icon={<ForwardSVG />}
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
              icon={<EditSVG />}
              message={messageToEdit}
              topMessage={messageToEdit?.message}
            />
          )}

          <input
            value={value}
            onChange={(e) => dispatch(setValue(e.target.value))}
            placeholder={!isSelecting && "Broadcast"}
            className={`bg-[#252525] transition-all ease-in-out relative focus:outline-none py-2 rounded-2xl px-4 ${
              isSelecting ? "w-[70%]" : "w-[89%]"
            } mx-auto`}
          />

          {showScrollButton && (
            <button
              onClick={() => messagesListRef.current?.scrollToBottom()}
              className={`appearAnimation absolute right-0 bottom-[120%] p-4 rounded-full bg-[#202021] hover:bg-[#303030] transition-all cursor-pointer`}
            >
              <ArrowUpSVG />
            </button>
          )}
          <div
            className={`${
              isSelecting && "opacity-0 scale-0"
            } transition-all absolute z-50 right-20 top-1/2 -translate-y-1/2`}
          >
            <PopUpMenu
              tl={true}
              icon={<ClipSVG />}
              buttonClasses="cursor-pointer z-10 text-[#ccc] p-2 rounded-full hover:bg-[#404040]"
            >
              <PopUpMenuItem itemClasses="w-[10rem] cursor-pointer">
                <input
                  className="opacity-0 absolute left-0
                                  cursor-pointer"
                  type="file"
                  onChange={async (e) => {
                    if (!e.target.files || e.target.files.length === 0) {
                      console.log("User canceled image selection.");
                      dispatch(resetMessage());
                      return;
                    }

                    await handlePostInput(
                      e.target.value,
                      e.target.files,
                      dispatch
                    );

                    dispatch(openModal("send-photo"));
                  }}
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
          <ActionButton
            action={() => {
              if (!messageToEdit) {
                if (messageType === "forward" || message !== "") {
                  sendMessage({ value });
                } else {
                  console.log("Voice message.");
                }
              } else {
                editMessage();
              }
            }}
          >
            {value === "" && !isForwarding && <MicrophoneSVG />}
            {!isSendingMessage &&
              !editIsPending &&
              (value !== "" || isForwarding) && <SendSVG />}
            {(isSendingMessage || editIsPending) && <ThrobberSVG />}
          </ActionButton>
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
            {addUserIsPending ? "PLEASE WAIT..." : "JOIN"}
          </Button>
        </div>
      )}
    </>
  );
}

ActiveChatInput.propTypes = {
  showScrollButton: PropTypes.bool.isRequired,
  viewChatInfo: PropTypes.bool.isRequired,
};
