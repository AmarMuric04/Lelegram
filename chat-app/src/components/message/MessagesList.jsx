import PropTypes from "prop-types";
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Message from "./message.types/Message";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { protectedPostData } from "../../utility/async";
import { useMutation } from "@tanstack/react-query";

const MessagesList = forwardRef(function MessagesList(
  { messages, viewInfo, setShowScrollButton },
  ref
) {
  const { user } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);
  const { messageType, forwardedChat, messageToEdit } = useSelector(
    (state) => state.message
  );
  const { open } = useSelector((state) => state.contextMenu);
  const [showPicker, setShowPicker] = useState({
    open: false,
    id: null,
  });
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });

  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const [messageId, setMessageId] = useState(null);
  const location = useLocation();

  const token = localStorage.getItem("token");

  const { mutate: addReaction } = useMutation({
    mutationFn: ({ emoji, message }) => {
      return protectedPostData(
        "/message/add-reaction",
        {
          reaction: emoji,
          messageId: message._id,
        },
        token
      );
    },
  });

  const handleEmojiSelect = (emoji, message) => {
    addReaction({ emoji: emoji.native, message });
    setShowPicker({ open: false, id: null });
  };

  useEffect(() => {
    const handleHidePicker = (e) => {
      if (!e.target.closest("#picker"))
        setShowPicker({ open: false, id: null });
    };

    if (showPicker.open) {
      setTimeout(() => {
        document.addEventListener("click", handleHidePicker);
      }, 0);
    } else {
      document.removeEventListener("click", handleHidePicker);
    }

    return () => {
      document.removeEventListener("click", handleHidePicker);
    };
  }, [showPicker.open]);

  const handleOpenPicker = (event, message) => {
    const { clientX, clientY } = event;
    const pickerHeight = 500;
    const pickerWidth = 250;
    const padding = 10;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let posX = clientX;
    let posY = clientY;

    if (clientY + pickerHeight + padding > windowHeight) {
      posY = windowHeight - 100 - pickerHeight - padding;
    }

    if (clientX + pickerWidth + padding > windowWidth) {
      posX = windowWidth - pickerWidth - padding;
    }

    setPickerPosition({ x: posX, y: posY });
    setShowPicker({
      open: true,
      id: message._id,
    });
  };

  useEffect(() => {
    const messageIdFromUrl = location.hash.replace("#", "");
    setMessageId(messageIdFromUrl);
  }, [location]);

  useEffect(() => {
    if (messageId) {
      const targetMessageElement = document.getElementById(messageId);
      if (targetMessageElement) {
        targetMessageElement.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      }
    }
  }, [messageId, messages]);

  useEffect(() => {
    const checkScroll = () => {
      if (!messagesRef.current) return;
      const el = messagesRef.current;
      setShowScrollButton(
        el.scrollHeight - el.clientHeight > el.scrollTop + 10
      );
    };

    const el = messagesRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);

    checkScroll();
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
    };
  }, [setShowScrollButton]);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  }));

  useEffect(() => {
    if (messageId) return;
    bottomRef.current?.scrollIntoView();
  }, [messages, messageId]);

  const groupedMessages = messages.data.reduce((groups, message) => {
    const messageDate = new Date(message.createdAt);
    const dateKey = messageDate.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const specialMessage =
    messageType === "reply" ||
    (messageType === "forward" && forwardedChat) ||
    messageToEdit;

  return (
    <div
      ref={messagesRef}
      className={`relative ${
        specialMessage && "bottom-10"
      } bottom-0 z-10 messages-list-container transition-all ${
        open ? "overflow-hidden" : "overflow-y-auto"
      } ${viewInfo ? "w-full" : "w-[90%]"}`}
    >
      <div className="text-center my-2 flex flex-col items-center gap-2">
        {activeChat?.createdAt && (
          <>
            <div className="inline-block bg-[#8675DC50] text-white px-4 text-sm font-semibold rounded-full p-1">
              {new Date(activeChat.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="inline-block bg-[#8675DC50] text-white px-4 text-sm font-semibold rounded-full p-1">
              Channel created
            </div>
          </>
        )}
      </div>

      {sortedDates.map((dateKey) => {
        const date = new Date(dateKey);
        const diffTime = Math.abs(new Date() - date);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        let header;
        if (date.getTime() === today.getTime()) {
          header = "Today";
        } else if (date.getTime() === yesterday.getTime()) {
          header = "Yesterday";
        } else if (diffDays < 7) {
          header = date.toLocaleDateString("en-US", { weekday: "long" });
        } else {
          header = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
        }

        return (
          <React.Fragment key={dateKey}>
            <div className="relative z-10 text-center my-2">
              <span className="bg-[#8675DC50] text-white px-4 text-sm font-semibold rounded-full p-1">
                {header}
              </span>
            </div>
            <ul className="flex flex-col px-2 gap-1 overflow-y-auto overflow-x-hidden">
              {groupedMessages[dateKey].map((message, index) => {
                const isMe = user._id === message.sender?._id;

                let showSenderInfo = true;
                if (index !== 0) {
                  const previousMessage = groupedMessages[dateKey][index - 1];
                  if (
                    previousMessage.type !== "system" &&
                    previousMessage.sender?._id === message.sender?._id
                  ) {
                    const prevTime = new Date(previousMessage.createdAt);
                    const currTime = new Date(message.createdAt);
                    const timeDifference = currTime - prevTime;
                    if (timeDifference <= 2 * 60 * 1000) {
                      showSenderInfo = false;
                    }
                  }
                }

                let showImage = true;
                if (index !== groupedMessages[dateKey].length - 1) {
                  const nextMessage = groupedMessages[dateKey][index + 1];
                  if (nextMessage.sender?._id === message.sender?._id) {
                    const currTime = new Date(message.createdAt);
                    const nextTime = new Date(nextMessage.createdAt);
                    if (nextTime - currTime <= 2 * 60 * 1000) {
                      showImage = false;
                    }
                  }
                }

                const isAdmin = activeChat?.admins?.some(
                  (u) => u._id.toString() === user._id
                );

                return (
                  <>
                    {message.type === "forward" && message.message && (
                      <>
                        <Message
                          key={`${message._id}-forward`}
                          message={{ ...message, type: "normal", extra: true }}
                          isMe={isMe}
                          isAdmin={isAdmin}
                          showImage={showImage}
                          showSenderInfo={showSenderInfo}
                          messageId={messageId}
                          onOpenPicker={handleOpenPicker}
                          addReaction={addReaction}
                        />
                        {showPicker.open && showPicker.id === message._id && (
                          <div
                            id="picker"
                            style={{
                              position: "fixed",
                              top: pickerPosition.y,
                              left: pickerPosition.x,
                              zIndex: 1000,
                            }}
                          >
                            <Picker
                              data={data}
                              onEmojiSelect={handleEmojiSelect}
                            />
                          </div>
                        )}
                      </>
                    )}
                    <Message
                      key={message._id}
                      message={message}
                      isMe={isMe}
                      isAdmin={isAdmin}
                      showImage={showImage}
                      showSenderInfo={showSenderInfo}
                      messageId={messageId}
                      onOpenPicker={handleOpenPicker}
                      addReaction={addReaction}
                    />
                    {showPicker.open && showPicker.id === message._id && (
                      <div
                        id="picker"
                        style={{
                          position: "fixed",
                          top: pickerPosition.y,
                          left: pickerPosition.x,
                          zIndex: 1000,
                        }}
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={(e) => handleEmojiSelect(e, message)}
                        />
                      </div>
                    )}
                    {message._id !== activeChat.lastMessage?._id &&
                      message._id === activeChat.lastReadMessageId && (
                        <p className="theme-bg font-semibold text-center">
                          Unread messages
                        </p>
                      )}
                  </>
                );
              })}
            </ul>
          </React.Fragment>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
});

MessagesList.propTypes = {
  messages: PropTypes.object,
  viewInfo: PropTypes.bool,
  setShowScrollButton: PropTypes.func,
};

export default MessagesList;
