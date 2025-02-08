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

const MessagesList = forwardRef(function MessagesList(
  { messages, viewInfo },
  ref
) {
  const { user } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const [messageId, setMessageId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const messageIdFromUrl = location.hash.replace("#", "");
    setMessageId(messageIdFromUrl);
  }, [location]);

  useEffect(() => {
    if (messageId) {
      const targetMessageElement = document.getElementById(messageId);
      if (targetMessageElement) {
        targetMessageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [messageId, messages]);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  }));

  useEffect(() => {
    if (messageId) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div
      className={`messages-list-container transition-all overflow-y-auto ${
        viewInfo ? "w-full" : "w-[90%]"
      }`}
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
            <div className="text-center my-2">
              <span className="bg-[#8675DC50] text-white px-4 text-sm font-semibold rounded-full p-1">
                {header}
              </span>
            </div>
            <ul
              ref={messagesRef}
              className="flex flex-col px-2 gap-1 overflow-y-auto overflow-x-hidden"
            >
              {groupedMessages[dateKey].map((message, index) => {
                const isMe = user._id === message.sender._id;

                let showSenderInfo = true;
                if (index !== 0) {
                  const previousMessage = groupedMessages[dateKey][index - 1];
                  if (previousMessage.sender._id === message.sender._id) {
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
                  if (nextMessage.sender._id === message.sender._id) {
                    const currTime = new Date(message.createdAt);
                    const nextTime = new Date(nextMessage.createdAt);
                    if (nextTime - currTime <= 2 * 60 * 1000) {
                      showImage = false;
                    }
                  }
                }

                const isAdmin = activeChat?.admins?.some(
                  (u) => u.toString() === message?.sender?._id
                );

                return (
                  <div
                    className={`relative ${
                      isMe ? "self-end flex-row" : "self-start flex-row-reverse"
                    }`}
                    key={message._id}
                  >
                    <li
                      id={message._id}
                      className={`relative z-50 appearAnimation flex max-w-[30rem] gap-4 ${
                        isMe
                          ? "self-end flex-row"
                          : "self-start flex-row-reverse"
                      }  ${!showImage && !isMe && "ml-12"} ${
                        showImage && "mb-1"
                      }`}
                    >
                      <div
                        className={`px-2 py-1 rounded-[1.25rem] ${
                          isMe
                            ? "bg-[#8675DC] ml-auto rounded-br-none"
                            : "bg-[#151515] mr-auto rounded-bl-none"
                        }`}
                      >
                        <div>
                          {showSenderInfo && !isMe && (
                            <div className="flex justify-between items-center gap-4">
                              <p className="text-sm font-semibold text-[#8675DC]">
                                {message.sender.firstName},{" "}
                                {message.sender.lastName[0]}
                              </p>
                              {isAdmin && (
                                <p className="text-[#ccc] text-xs">admin</p>
                              )}
                            </div>
                          )}
                          <div className="flex flex-wrap items-baseline justify-end">
                            <p className="flex-grow break-words">
                              {message.message}
                            </p>
                            <p className="flex-shrink-0 whitespace-nowrap text-xs text-[#ccc] ml-2">
                              {new Date(message.createdAt).toLocaleString(
                                "en-US",
                                {
                                  weekday: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      {showImage && !isMe && (
                        <img
                          src={`http://localhost:3000/${message.sender.imageUrl}`}
                          alt={`${message.sender.firstName} ${message.sender.lastName}`}
                          className="w-8 h-8 rounded-full mt-1"
                        />
                      )}
                    </li>
                    {message._id === messageId && (
                      <div
                        className={`showAnimation absolute top-0 -left-[100rem] bg-[#8675DC50] min-w-[300rem] h-full`}
                      ></div>
                    )}
                  </div>
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
};

export default MessagesList;
