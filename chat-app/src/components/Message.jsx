import { useDispatch } from "react-redux";
import {
  setForwardedChat,
  setMessage,
  setMessageToEdit,
  setMessageType,
} from "../store/messageSlice";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "../utility/util";
import { openModal } from "../store/modalSlice";

export default function Message({
  message,
  isMe,
  showImage,
  showSenderInfo,
  messageId,
  isAdmin,
  isActiveContextMenu,
  contextMenuPosition,
  onContextMenu,
  onClearContextMenu,
}) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const [showForward, setShowForward] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsetOpen = () => {
      setOpen(false);
      onClearContextMenu();
    };

    const handleMouseMove = (e) => {
      if (!modalRef.current) return;

      const rect = modalRef.current.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        (e.clientX - elemX) ** 2 + (e.clientY - elemY) ** 2
      );
      if (distance > 200) {
        setOpen(false);
        onClearContextMenu();
      }
    };

    if (open) {
      const timeout = setTimeout(() => {
        document.body.addEventListener("click", unsetOpen);
        document.addEventListener("mousemove", handleMouseMove);
      }, 10);

      return () => {
        clearTimeout(timeout);
        document.body.removeEventListener("click", unsetOpen);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }

    return () => {
      document.body.removeEventListener("click", unsetOpen);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open, onClearContextMenu]);

  const handleContextMenu = (e) => {
    e.preventDefault();

    const menuHeight = 300;
    const screenHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (y + menuHeight > screenHeight) {
      y = screenHeight - menuHeight;
      console.log(y);
    }

    onContextMenu(x, y);
    setOpen(true);
  };

  const handleClick = () => {
    dispatch(setMessage(message));
    dispatch(setMessageType("reply"));
  };

  const contextMenuPortal =
    open &&
    isActiveContextMenu &&
    contextMenuPosition &&
    ReactDOM.createPortal(
      <div
        onClick={() => {
          onClearContextMenu();
          setOpen(false);
        }}
        ref={modalRef}
        className="appearAnimation text-white bg-[#202021] p-2 rounded-xl z-[9999]"
        style={{
          position: "absolute",
          top: contextMenuPosition.y,
          left: contextMenuPosition.x,
        }}
      >
        <button
          onClick={handleClick}
          className="flex w-full py-2  px-2 items-center gap-4 hover:bg-[#303030] rounded-md transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M14.25 13.25c-.5-6-5.5-7.5-8-7v-3.5L1.75 8l4.5 5.25v-3.5c2.5-.5 6.5.5 8 3.5"
            />
          </svg>
          <p className="text-sm font-semibold">Reply</p>
        </button>

        <button
          onClick={() => copyToClipboard(message.message)}
          className="flex w-full py-2  px-2 items-center gap-4 hover:bg-[#303030] rounded-md transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z" />
              <path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h4a3 3 0 0 1 3 3" />
            </g>
          </svg>
          <p className="text-sm font-semibold">Copy</p>
        </button>

        <button
          onClick={() => {
            dispatch(openModal("forward-to-channels"));
            dispatch(setMessageType("forward"));
            dispatch(setMessage(message));
            dispatch(setForwardedChat(null));
          }}
          className="flex w-full py-2  px-2 items-center gap-4 hover:bg-[#303030] rounded-md transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            className="-scale-x-100"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M14.25 13.25c-.5-6-5.5-7.5-8-7v-3.5L1.75 8l4.5 5.25v-3.5c2.5-.5 6.5.5 8 3.5"
            />
          </svg>
          <p className="text-sm font-semibold">Forward</p>
        </button>

        {!isMe && (
          <button
            onClick={handleClick}
            className="flex w-full py-2  px-2 items-center gap-4 hover:bg-[#303030] rounded-md transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 21v-5.313m0 0c5.818-4.55 10.182 4.55 16 0V4.313c-5.818 4.55-10.182-4.55-16 0z"
              />
            </svg>
            <p className="text-sm font-semibold">Report</p>
          </button>
        )}
        <button
          onClick={() =>
            copyToClipboard(
              "http://localhost:5173/" + message.chat._id + "#" + message._id
            )
          }
          className="flex w-full py-2  px-2 items-center gap-4 hover:bg-[#303030] rounded-md transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13.293 3.96a4.771 4.771 0 1 1 6.747 6.747l-3.03 3.03l-1.415-1.413l3.03-3.031a2.771 2.771 0 1 0-3.918-3.92l-3.031 3.031l-1.414-1.414zm2.12 6.04l-5.415 5.414L8.584 14l5.414-5.414zm-7.01 1.676l-3.03 3.031a2.771 2.771 0 1 0 3.92 3.92l3.03-3.031l1.414 1.414l-3.03 3.03a4.771 4.771 0 1 1-6.748-6.747l3.03-3.03z"
            />
          </svg>
          <p className="text-sm font-semibold">Copy Message Link</p>
        </button>
        {isMe && (
          <button
            onClick={() => {
              dispatch(setMessageToEdit(message));
            }}
            className="flex w-full py-2  px-2 items-center gap-4 hover:bg-[#303030] rounded-md transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L17.625 2.175L21.8 6.45L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
              />
            </svg>
            <p className="text-sm font-semibold">Edit</p>
          </button>
        )}
        <button
          onClick={handleClick}
          className="flex w-full py-2  px-2 items-center gap-4 hover:bg-[#303030] rounded-md transition-all cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M6.7 9.29L9 11.6l4.3-4.3l1.4 1.42L9 14.4l-3.7-3.7l1.4-1.42z"
            />
          </svg>
          <p className="text-sm font-semibold">Select</p>
        </button>
        {isMe && (
          <button
            onClick={handleClick}
            className="flex w-full py-2  px-2 items-center gap-4 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-md transition-all cursor-pointer"
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
            <p className="text-sm font-semibold">Delete</p>
          </button>
        )}
      </div>,
      document.body
    );

  if (message.type === "forward" && message.message) {
    showSenderInfo = false;
  }

  if (message.extra) {
    showImage = false;
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      onMouseOver={() => setShowForward(true)}
      onMouseLeave={() => setShowForward(false)}
      className={`w-[50rem] flex z-10 justify-end relative ${
        isMe ? "self-end flex-row" : "self-start flex-row-reverse"
      }`}
      key={message._id}
    >
      <li
        id={message._id}
        className={`relative z-50 appearAnimation flex max-w-[30rem] gap-2 ${
          isMe ? "self-end flex-row" : "self-start flex-row-reverse"
        } ${!showImage && !isMe && "ml-12"} ${showImage && "mb-1"}`}
      >
        {showForward && (
          <button
            className={`bg-[#8675DC20] hover:bg-[#8675DC80] cursor-pointer p-2 rounded-full appearAnimation z-50 transition-all absolute top-1/2 -translate-y-1/2 ${
              isMe ? "right-[110%]" : "left-[110%] -scale-x-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
            >
              <path
                fill="currentColor"
                d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16 16 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"
              />
            </svg>
          </button>
        )}
        <div
          className={`px-2 py-1 rounded-[1.25rem] ${
            isMe
              ? "bg-[#8675DC] ml-auto rounded-br-none"
              : "bg-[#151515] mr-auto rounded-bl-none"
          } ${!showSenderInfo && !isMe && "rounded-tl-md"} ${
            !showSenderInfo && isMe && "rounded-tr-md"
          }`}
        >
          <div>
            {showSenderInfo && !isMe && (
              <div className="flex justify-between items-center gap-4">
                <p className="text-sm font-semibold text-[#8675DC]">
                  {message.sender.firstName}, {message.sender.lastName[0]}
                </p>
                {isAdmin && <p className="text-[#ccc] text-xs">admin</p>}
              </div>
            )}
            {message.type === "forward" && (
              <Link to={`/${message.referenceMessageId.chat?._id}`}>
                <div
                  className={`text-sm cursor-pointer transition-all px-2 py-1 rounded-md`}
                >
                  <p className="font-semibold">Forwarded from</p>
                  <div className="flex items-center gap-1">
                    {message.referenceMessageId.chat?.imageUrl ? (
                      <img
                        src={`http://localhost:3000/${message.referenceMessageId.chat.imageUrl}`}
                        alt={message.referenceMessageId.chat.name}
                        className="min-h-6 max-h-6 min-w-6 max-w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-6 w-6 rounded-full text-[0.5rem] grid place-items-center font-semibold text-white"
                        style={{
                          background: `linear-gradient(${
                            message.referenceMessageId.chat?.gradient?.direction
                          }, ${message.referenceMessageId.chat?.gradient?.colors.join(
                            ", "
                          )})`,
                        }}
                      >
                        {message.referenceMessageId.chat?.name?.slice(0, 3)}
                      </div>
                    )}
                    <p>{message.referenceMessageId.chat?.name}</p>
                  </div>
                </div>
              </Link>
            )}
            {message.type === "reply" && (
              <Link
                to={`/${message.chat._id}#${message.referenceMessageId._id}`}
              >
                <div
                  className={`my-1 text-sm cursor-pointer transition-all ${
                    isMe
                      ? "hover:bg-[#ffffff40] bg-[#ffffff20] border-white"
                      : "hover:bg-[#8675DC40] bg-[#8675DC20] border-[#8675DC]"
                  } ${isMe ? "border-l-4" : "border-r-4"} px-2 py-1 rounded-md`}
                >
                  <p className="font-semibold">
                    {message.referenceMessageId.sender.firstName}
                  </p>
                  <p>{message.referenceMessageId.message}</p>
                </div>
              </Link>
            )}
            <div className="flex flex-wrap items-baseline justify-end">
              {message.type !== "forward" && (
                <p className="flex-grow break-words">{message.message}</p>
              )}
              {message.type === "forward" && (
                <p className="flex-grow break-words">
                  {message.referenceMessageId.message}
                </p>
              )}
              <p className="flex-shrink-0 whitespace-nowrap text-xs text-[#ccc] ml-2">
                {new Date(message.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
          </div>
        </div>
        {showImage && !isMe && (
          <img
            src={`http://localhost:3000/${message.sender.imageUrl}`}
            alt={`${message.sender.firstName} ${message.sender.lastName}`}
            className="w-10 h-10 rounded-full mt-1"
          />
        )}
      </li>
      {message._id === messageId && (
        <div
          className={`showAnimation absolute top-0 -left-[100rem] bg-[#8675DC50] min-w-[300rem] h-full`}
        ></div>
      )}

      {contextMenuPortal}
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  isMe: PropTypes.bool.isRequired,
  showImage: PropTypes.bool.isRequired,
  showSenderInfo: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired,
  isActiveContextMenu: PropTypes.bool,
  contextMenuPosition: PropTypes.shape({
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onContextMenu: PropTypes.func.isRequired,
  onClearContextMenu: PropTypes.func.isRequired,
};
