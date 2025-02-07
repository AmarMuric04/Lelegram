import PropTypes from "prop-types";
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { useSelector } from "react-redux";

const MessagesList = forwardRef(function MessagesList({ messages }, ref) {
  const { user } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);
  const bottomRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  }));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      className="messages-list-container"
      style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
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
            <ul className="flex flex-col px-2 gap-2">
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

                return (
                  <li
                    key={message._id}
                    className={`appearAnimation  p-2 rounded-xl max-w-[80%] ${
                      isMe
                        ? "bg-[#8675DC] ml-auto self-end rounded-br-none"
                        : "bg-[#151515] mr-auto self-start rounded-bl-none"
                    }`}
                  >
                    <div>
                      {showSenderInfo && (
                        <p
                          className={`text-sm font-semibold ${
                            isMe ? "text-[#151515]" : "text-[#8675DC]"
                          }`}
                        >
                          {message.sender.firstName},{" "}
                          {message.sender.lastName[0]}
                        </p>
                      )}
                      <p id={message._id}>{message.message}</p>
                      <p className="text-[#ccc] text-xs float-right">
                        {new Date(message.createdAt).toLocaleString("en-US", {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </p>
                    </div>
                  </li>
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
};

export default MessagesList;
