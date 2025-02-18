import { useDispatch, useSelector } from "react-redux";
import {
  setForwardedChat,
  setIsSelecting,
  setMessage,
  setMessageToEdit,
  setMessageType,
  setSelected,
} from "../store/redux/messageSlice";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { openModal } from "../store/redux/modalSlice";
import { useMutation } from "@tanstack/react-query";
import { setActiveChat } from "../store/redux/chatSlice";
import {
  closeContextMenu,
  openContextMenu,
} from "../store/redux/contextMenuSlice";
import { LightbulbSVG } from "../../public/svgs";
import CircleCheckbox from "./CircleCheckbox";
import PollOptionsList from "./poll/PollOptionsList";
import MessageContextMenu from "./message/MessageContextMenu";

export default function Message({
  message,
  isMe,
  showImage,
  showSenderInfo,
  messageId,
  isAdmin,
}) {
  const dispatch = useDispatch();
  const [isHovering, setIsHovering] = useState(false);
  const [votes, setVotes] = useState([]);
  const { isSelecting, selected } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);
  const { open } = useSelector((state) => state.contextMenu);

  useEffect(() => {
    if (!isSelecting) dispatch(setSelected([]));
  }, [isSelecting, dispatch]);

  if (message.type === "forward" && message.message) {
    showSenderInfo = false;
  }

  if (message.extra) {
    showImage = false;
  }

  const isSelected = selected.some((s) => s._id === message._id);

  const handleContextMenu = (e) => {
    e.preventDefault();

    const menuHeight = 320;
    const screenHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (y + menuHeight > screenHeight) {
      y = screenHeight - menuHeight;
    }

    dispatch(closeContextMenu());

    setTimeout(() => {
      dispatch(openContextMenu({ message, x, y }));
    }, 0);
  };

  const token = localStorage.getItem("token");

  const handleAddVote = async () => {
    try {
      const response = await fetch("http://localhost:3000/poll/add-vote", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId: message.poll,
          options: votes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add a vote");
      }

      const data = await response.json();

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: addVote } = useMutation({
    mutationFn: handleAddVote,
  });

  const handleAddReaction = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/message/add-reaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            reaction: "❤️",
            messageId: message._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Couldn't add the reaction.");
      }

      const data = await response.json();

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: addReaction } = useMutation({
    mutationFn: handleAddReaction,
  });

  const hasVoted = message.poll?.options.some((opt) =>
    opt.voters.includes(user._id)
  );

  const totalPollVotes = message.poll?.options.reduce(
    (a, b) => (a += b.votes),
    0
  );

  const votedOptions = message.poll?.options
    .filter((opt) => opt.voters.includes(user._id))
    .map((option) => option.text);

  const userDidReact = !Object.entries(message.reactions || {}).some(
    ([_, users]) => users.includes(user._id)
  );

  return (
    <div
      onDoubleClick={() => {
        dispatch(setMessage(message));
        dispatch(setMessageType("reply"));
      }}
      onClick={() => {
        setIsHovering(false);
        if (!isSelecting || open) return;

        if (isSelected) {
          const newSelected = selected.filter((s) => s._id !== message._id);
          dispatch(setSelected(newSelected));
          if (newSelected.length === 0) {
            dispatch(setIsSelecting(false));
          }
        } else dispatch(setSelected([...selected, message]));
      }}
      onContextMenu={handleContextMenu}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`w-full overflow-auto flex z-10 justify-end relative ${
        isSelecting && "cursor-pointer"
      } ${isMe ? "self-end flex-row" : "self-start flex-row-reverse"}`}
      key={message._id}
    >
      {isSelecting && (
        <div className="appearAnimation absolute z-50 left-0 top-1/2 -translate-y-1/2">
          <CircleCheckbox isChecked={isSelected} id="cbx-12" />
        </div>
      )}
      <li
        id={message._id}
        className={`relative transition-all left-0 ${
          !isMe && isSelecting && "left-12"
        } z-50 appearAnimation flex gap-2 ${
          isMe ? "self-end flex-row" : "self-start flex-row-reverse"
        } ${!showImage && !isMe && "ml-12"} ${showImage && "mb-1"}`}
      >
        <MessageContextMenu
          isAdmin={isAdmin}
          isMe={isMe}
          isSelected={isSelected}
          message={message}
        />
        {isHovering && !isSelecting && (
          <button
            onClick={() => {
              dispatch(openModal("forward-to-channels"));
              dispatch(setMessageType("forward"));
              dispatch(setMessage(message));
              dispatch(setForwardedChat(null));
            }}
            className={`bg-[#8675DC20] hover:bg-[#8675DC80] cursor-pointer p-1 rounded-full appearAnimation z-50 transition-all absolute top-1/2 -translate-y-1/2 ${
              isMe ? "-left-16" : "-right-16 -scale-x-100"
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
        {isHovering && userDidReact && (
          <button
            onClick={addReaction}
            className={`appearAnimation cursor-pointer group absolute bottom-0 ${
              isMe ? "-left-6" : "-right-6"
            } p-1 rounded-full bg-[#202021]`}
          >
            <p className="group-hover:scale-125">❤️</p>
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
              <Link
                className={`${isSelecting && "pointer-events-none"}`}
                to={`/${
                  message.referenceMessageId.chat?._id
                    ? message.referenceMessageId.chat?._id
                    : ""
                }`}
              >
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
                          background: message.referenceMessageId.chat
                            ? `linear-gradient(${
                                message.referenceMessageId.chat?.gradient
                                  ?.direction
                              }, ${message.referenceMessageId.chat?.gradient?.colors.join(
                                ", "
                              )})`
                            : "darkred",
                        }}
                      >
                        {message.referenceMessageId.chat
                          ? message.referenceMessageId.chat?.name?.slice(0, 3)
                          : "x"}
                      </div>
                    )}
                    <p>
                      {message.referenceMessageId.chat?.name
                        ? message.referenceMessageId.chat?.name
                        : "Channel deleted"}
                    </p>
                  </div>
                </div>
              </Link>
            )}
            {message.type === "reply" && (
              <Link
                className={`${isSelecting && "pointer-events-none"}`}
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
                  <div className="flex items-center gap-2">
                    {message.referenceMessageId.imageUrl && (
                      <img
                        className="max-h-[16px]"
                        src={`http://localhost:3000/${message.referenceMessageId.imageUrl}`}
                      />
                    )}
                    {message.referenceMessageId.message
                      ? message.referenceMessageId.message
                      : "Photo"}
                    {message.referenceMessageId.type === "poll" &&
                      "📊 " + message.referenceMessageId.poll.question}
                  </div>
                </div>
              </Link>
            )}
            {message.type !== "forward" && message.imageUrl && (
              <img
                className="max-w-[25rem] max-h-[25rem] self-center mx-auto rounded-lg"
                src={`http://localhost:3000/${message.imageUrl}`}
                alt="Message"
              />
            )}
            {message.type === "poll" && (
              <div className="min-w-[20rem]">
                <p className="font-semibold">{message.poll.question}</p>
                <div className="text-sm flex items-center w-full">
                  <p>
                    {message.poll.settings.anonymousVoting && "Anonymous"}{" "}
                    {message.poll.settings.quizMode ? " Quiz" : "Voting"}
                  </p>

                  {hasVoted && message.poll.settings.quizMode && (
                    <button
                      onClick={() => alert(message.poll.explanation)}
                      className="self-end ml-auto cursor-pointer"
                    >
                      <LightbulbSVG />
                    </button>
                  )}
                </div>
                <PollOptionsList
                  message={message}
                  hasVoted={hasVoted}
                  votedOptions={votedOptions}
                  totalPollVotes={totalPollVotes}
                  votes={votes}
                  setVotes={setVotes}
                  addVote={addVote}
                />
                {message.poll.settings.multipleAnswers && (
                  <button
                    onClick={() => addVote()}
                    className="font-semibold w-full mt-4 cursor-pointer"
                  >
                    Vote
                  </button>
                )}
              </div>
            )}
            <div className="flex flex-wrap items-baseline justify-end">
              {message.type !== "forward" && message.type !== "poll" && (
                <p className="flex-grow break-words break-all">
                  {message.message}
                </p>
              )}
              {message.type === "forward" && (
                <div className="flex-grow break-words break-all flex flex-col gap-2">
                  {message.referenceMessageId.imageUrl && (
                    <img
                      className="max-h-[25rem] max-w-[25rem]"
                      src={`http://localhost:3000/${message.referenceMessageId.imageUrl}`}
                    />
                  )}
                  {message.referenceMessageId?.type === "poll" &&
                    "📊 " + message.referenceMessageId?.poll.question}
                  {message.referenceMessageId
                    ? message.referenceMessageId.message
                      ? message.referenceMessageId.message
                      : message.message
                    : message.message}
                </div>
              )}
              <div className="flex-shrink-0 flex gap-2 whitespace-nowrap text-xs text-[#ccc] ml-2">
                {message.edited && message.type !== "forward" && (
                  <p className="italic">edited</p>
                )}
                <p>
                  {new Date(message.createdAt).toLocaleString("en-US", {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </div>
            {message.reactions &&
              Object.keys(message.reactions).some(
                (emoji) => message.reactions[emoji].length > 0
              ) && (
                <div className="cursor-pointer rounded-lg bg-[#ffffff50] hover:bg-[#ffffff70] inline-flex">
                  {Object.entries(message.reactions)
                    .filter(([_, users]) => users.length > 0)
                    .map(([emoji, users]) => (
                      <p
                        onClick={addReaction}
                        className="py-1 px-3"
                        key={emoji}
                      >
                        {emoji} {users.length}
                      </p>
                    ))}
                </div>
              )}
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
      {(message._id === messageId || isSelected) && (
        <div
          className={`${isSelected && "bg-[#8675DC20]"} ${
            !isSelecting && "showAnimation"
          }  absolute top-0 -left-[100rem] bg-[#8675DC50] min-w-[300rem] h-full`}
        ></div>
      )}
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
  onContextMenu: PropTypes.func.isRequired,
  onClearContextMenu: PropTypes.func.isRequired,
};
