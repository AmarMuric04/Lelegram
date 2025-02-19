import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetMessage } from "../redux/messageSlice";
import PropTypes from "prop-types";
import { resetImage } from "../redux/imageSlice";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { activeChat } = useSelector((state) => state.chat);
  const { select, message, messageType } = useSelector(
    (state) => state.message
  );
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const messagesListRef = useRef();

  const handleSendMessage = async ({ poll, msgImage, value }) => {
    try {
      const formData = new FormData();
      console.log(msgImage);

      if (poll) {
        formData.append("pollQuestion", poll.question);
        poll.options
          ?.filter((p) => p.trim() !== "")
          .forEach((option, index) => {
            formData.append(`pollOptions[${index}]`, option);
          });
        formData.append("pollSettings", JSON.stringify(poll.settings));
        formData.append("pollExplanation", poll.explanation);
        formData.append("pollCorrectAnswer", poll.correctAnswer);
      }

      if (msgImage) {
        formData.append("message", msgImage.caption);
        if (msgImage.url) {
          formData.append("imageUrl", msgImage.url);
        }
      }

      if (!msgImage) formData.append("message", value);

      formData.append("chatId", activeChat._id);
      formData.append("type", messageType);

      if (Array.isArray(message)) {
        message.forEach((m, index) => {
          formData.append(`referenceMessageId[${index}]`, m._id);
        });
      } else if (message?._id) {
        formData.append("referenceMessageId", message._id);
      }

      const response = await fetch(
        "import.meta.env.VITE_SERVER_PORT/message/send-message",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Sending a message failed.");
      }

      queryClient.invalidateQueries(["search", select]);

      dispatch(resetMessage());

      messagesListRef.current?.scrollToBottom();

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { mutate: sendMessage, isSendingMessage } = useMutation({
    mutationFn: (data = {}) => handleSendMessage(data),
    onSuccess: () => {
      dispatch(resetMessage());
      dispatch(resetImage());
    },
  });

  const value = { sendMessage, isSendingMessage };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

MessageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
