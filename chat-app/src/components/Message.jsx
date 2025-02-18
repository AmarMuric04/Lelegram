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
import ContextMenu from "./context/ContextMenu";
import ContextMenuItem from "./context/ContextMenuItem";
import {
  CopySelectedSVG,
  EditSVG,
  FlagSVG,
  ForwardSVG,
  LinkSVG,
  PinSVG,
  ReplySVG,
  SelectSVG,
  TrashSVG,
  UnpinSVG,
} from "../../public/svgs";
import { copyToClipboard } from "../utility/util";

export default function Message({
  message,
  isMe,
  showImage,
  showSenderInfo,
  messageId,
  isAdmin,
}) {
  const dispatch = useDispatch();
  const [showForward, setShowForward] = useState(false);
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

  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    console.log("open?");

    const menuHeight = 320;
    const screenHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (y + menuHeight > screenHeight) {
      y = screenHeight - menuHeight;
    }

    dispatch(closeContextMenu());

    setTimeout(() => {
      dispatch(openContextMenu({ id: messageId, x, y }));
    }, 0);
  };

  const handleClick = () => {
    dispatch(setMessage(message));
    dispatch(setMessageType("reply"));
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

  const handlePinMessage = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/add-pinned-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            chatId: message.chat._id,
            messageId: message._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Couldn't add the reaction.");
      }

      const data = await response.json();

      if (activeChat.pinnedMessage === message) {
        dispatch(setActiveChat({ ...activeChat, pinnedMessage: null }));
      } else dispatch(setActiveChat({ ...activeChat, pinnedMessage: message }));

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: pinMessage } = useMutation({
    mutationFn: handlePinMessage,
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

  return (
    <div
      onDoubleClick={handleClick}
      onClick={() => {
        setShowForward(false);
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
      onMouseOver={() => setShowForward(true)}
      onMouseLeave={() => setShowForward(false)}
      className={`w-full overflow-hidden flex z-10 justify-end relative ${
        isSelecting && "cursor-pointer"
      } ${isMe ? "self-end flex-row" : "self-start flex-row-reverse"}`}
      key={message._id}
    >
      {open && (
        <ContextMenu>
          {isSelecting && !isSelected && (
            <ContextMenuItem
              action={() => dispatch(setSelected([...selected, message]))}
              icon={<SelectSVG />}
            >
              Select
            </ContextMenuItem>
          )}
          {isSelecting && isSelected && (
            <>
              <ContextMenuItem
                action={() => {
                  const msg = selected
                    .reduce((acc, item) => {
                      if (!item.message) {
                        acc.push(item.referenceMessageId.message);
                      } else acc.push(item.message);

                      return acc;
                    }, [])
                    .join("");

                  copyToClipboard(msg);
                }}
                icon={<CopySelectedSVG />}
              >
                Copy selected
              </ContextMenuItem>
              <ContextMenuItem
                action={() => {
                  dispatch(openModal("forward-to-channels"));
                  dispatch(setMessageType("forward"));
                  dispatch(setMessage(selected));
                  dispatch(setForwardedChat(null));
                }}
                icon={<ForwardSVG dimension={20} />}
              >
                Forward selected
              </ContextMenuItem>
              <ContextMenuItem
                action={() => {
                  dispatch(setSelected([]));
                  dispatch(setIsSelecting(false));
                }}
                icon={<SelectSVG />}
              >
                Clear selection
              </ContextMenuItem>
              {(isMe || isAdmin) && (
                <ContextMenuItem
                  action={() => {
                    dispatch(setMessage(message));
                    dispatch(openModal("delete-message"));
                  }}
                  icon={<TrashSVG />}
                  className="bg-red-500/20 text-red-500 hover:bg-red-500/40"
                >
                  Delete selected
                </ContextMenuItem>
              )}
            </>
          )}
          {!isSelecting && (
            <>
              <ContextMenuItem
                action={handleClick}
                icon={<ReplySVG dimension={20} />}
              >
                Reply
              </ContextMenuItem>
              <ContextMenuItem
                action={() => copyToClipboard(message.message)}
                icon={<CopySelectedSVG />}
              >
                Copy
              </ContextMenuItem>
              {isAdmin && (
                <ContextMenuItem
                  action={pinMessage}
                  icon={
                    activeChat.pinnedMessage?._id !== message._id ? (
                      <PinSVG />
                    ) : (
                      <UnpinSVG />
                    )
                  }
                >
                  {activeChat.pinnedMessage?._id !== message._id
                    ? "Pin"
                    : "Unpin"}
                </ContextMenuItem>
              )}
              <ContextMenuItem
                action={() => {
                  dispatch(openModal("forward-to-channels"));
                  dispatch(setMessageType("forward"));
                  dispatch(setMessage(message));
                  dispatch(setForwardedChat(null));
                }}
                icon={<ForwardSVG />}
              >
                Forward
              </ContextMenuItem>
              {!isMe && (
                <ContextMenuItem action={handleClick} icon={<FlagSVG />}>
                  Report
                </ContextMenuItem>
              )}
              <ContextMenuItem
                action={() =>
                  copyToClipboard(
                    "http://localhost:5173/" +
                      message.chat._id +
                      "#" +
                      message._id
                  )
                }
                icon={<LinkSVG />}
              >
                Copy Message Link
              </ContextMenuItem>
              {isMe && message.type !== "forward" && (
                <ContextMenuItem
                  action={() => {
                    dispatch(setMessageToEdit(message));
                  }}
                  icon={<EditSVG />}
                >
                  Edit
                </ContextMenuItem>
              )}
              <ContextMenuItem
                action={() => {
                  dispatch(setIsSelecting(true));
                  dispatch(setSelected([message]));
                }}
                icon={<SelectSVG />}
              >
                Select
              </ContextMenuItem>
              {(isMe || isAdmin) && (
                <ContextMenuItem
                  action={() => {
                    dispatch(setMessage(message));
                    dispatch(openModal("delete-message"));
                  }}
                  icon={<TrashSVG />}
                  buttonClasses="bg-red-500/20 text-red-500 hover:bg-red-500/40"
                >
                  Delete
                </ContextMenuItem>
              )}
            </>
          )}
        </ContextMenu>
      )}
      {isSelecting && (
        <div className="appearAnimation absolute z-50 left-0 top-1/2 -translate-y-1/2">
          <div className="checkbox-wrapper-12">
            <div className="cbx">
              <input id="cbx-12" checked={isSelected} type="checkbox" />
              <label htmlFor="cbx-12"></label>
              <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                <path d="M2 8.36364L6.23077 12L13 2"></path>
              </svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
              <defs>
                <filter id="goo-12">
                  <fegaussianblur
                    in="SourceGraphic"
                    stdDeviation="4"
                    result="blur"
                  ></fegaussianblur>
                  <fecolormatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                    result="goo-12"
                  ></fecolormatrix>
                  <feblend in="SourceGraphic" in2="goo-12"></feblend>
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      )}
      <li
        id={message._id}
        className={`relative transition-all left-0 ${
          !isMe && isSelecting && "left-12"
        } z-50 appearAnimation flex max-w-[30rem] gap-2 ${
          isMe ? "self-end flex-row" : "self-start flex-row-reverse"
        } ${!showImage && !isMe && "ml-12"} ${showImage && "mb-1"}`}
      >
        {showForward && !isSelecting && (
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
        {showForward &&
          !Object.entries(message.reactions || {}).some(([_, users]) =>
            users.includes(user._id)
          ) && (
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
                  <div className="flex items-end gap-2">
                    {message.referenceMessageId.imageUrl && (
                      <img
                        className="max-h-[16px]"
                        src={`http://localhost:3000/${message.referenceMessageId.imageUrl}`}
                      />
                    )}
                    {message.referenceMessageId.message}
                    {message.referenceMessageId.type === "poll" &&
                      "📊 " + message.referenceMessageId.poll.question}
                  </div>
                </div>
              </Link>
            )}
            {message.type !== "forward" && message.imageUrl && (
              <img
                className="max-w-[20rem] max-h-[20rem] self-center mx-auto rounded-lg"
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
                    <svg
                      onClick={() => alert(message.poll.explanation)}
                      className="self-end ml-auto cursor-pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        color="currentColor"
                      >
                        <path d="M5.143 14A7.8 7.8 0 0 1 4 9.919C4 5.545 7.582 2 12 2s8 3.545 8 7.919A7.8 7.8 0 0 1 18.857 14" />
                        <path d="M14 10c-.613.643-1.289 1-2 1s-1.387-.357-2-1m-2.617 7.098c-.092-.276-.138-.415-.133-.527a.6.6 0 0 1 .382-.53c.104-.041.25-.041.54-.041h7.656c.291 0 .436 0 .54.04a.6.6 0 0 1 .382.531c.005.112-.041.25-.133.527c-.17.511-.255.767-.386.974a2 2 0 0 1-1.2.869c-.238.059-.506.059-1.043.059h-3.976c-.537 0-.806 0-1.043-.06a2 2 0 0 1-1.2-.868c-.131-.207-.216-.463-.386-.974M15 19l-.13.647c-.14.707-.211 1.06-.37 1.34a2 2 0 0 1-1.113.912C13.082 22 12.72 22 12 22s-1.082 0-1.387-.1a2 2 0 0 1-1.113-.913c-.159-.28-.23-.633-.37-1.34L9 19m3-3.5V11" />
                      </g>
                    </svg>
                  )}
                </div>
                {message.poll.options.map((option, index) => {
                  return hasVoted ? (
                    <div className="flex gap-4 w-full h-[40px] mt-2">
                      <div className="flex flex-col justify-between w-[10%] h-full">
                        <p className="font-semibold text-sm self-end">
                          {((option.votes / totalPollVotes) * 100).toFixed(0)}%
                        </p>

                        {votedOptions.includes(option.text) ? (
                          message.poll.settings.quizMode &&
                          option.text !== message.poll.correctAnswer ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              className="bg-red-500 rounded-full p-[2px] self-end"
                            >
                              <rect width="15" height="15" fill="none" />
                              <path
                                fill="currentColor"
                                d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 32 32"
                              className="self-end"
                            >
                              <rect width="32" height="32" fill="none" />
                              <path
                                fill="currentColor"
                                d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"
                              />
                              <path
                                fill="none"
                                d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z"
                              />
                            </svg>
                          )
                        ) : option.text === message.poll.correctAnswer ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 32 32"
                            className="self-end"
                          >
                            <rect width="32" height="32" fill="none" />
                            <path
                              fill="currentColor"
                              d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"
                            />
                            <path
                              fill="none"
                              d="m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z"
                            />
                          </svg>
                        ) : (
                          <div className="h-[15px]"></div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between w-[90%] h-full">
                        <p>{option.text}</p>
                        <div
                          className={`h-[3px] rounded-full transition-all ${
                            votedOptions.includes(option.text) &&
                            message.poll.settings.quizMode &&
                            option.text !== message.poll.correctAnswer
                              ? "bg-red-500"
                              : "bg-white"
                          }`}
                          style={{
                            width: `${(option.votes / totalPollVotes) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-2 my-4"
                      key={option.text + index + message.poll._id}
                    >
                      <div
                        onClick={() => {
                          if (!message.poll.settings.multipleAnswers) {
                            if (votes === option.text) setVotes([]);
                            else setVotes([option.text]);
                            addVote();
                          } else if (votes.includes(option.text)) {
                            setVotes(
                              votes.filter((vote) => vote !== option.text)
                            );
                          } else {
                            setVotes([...votes, option.text]);
                          }
                        }}
                      >
                        <div className="checkbox-wrapper-12">
                          <div className="cbx">
                            <input
                              checked={
                                (Array.isArray(votes) &&
                                  votes.includes(option.text)) ||
                                (!message.poll.multipleAnswers &&
                                  votes === option.text)
                              }
                              id={option.text + index + message.poll._id}
                              type="checkbox"
                            />
                            <label
                              htmlFor={option.text + index + message.poll._id}
                            ></label>
                            <svg
                              width="15"
                              height="14"
                              viewBox="0 0 15 14"
                              fill="none"
                            >
                              <path d="M2 8.36364L6.23077 12L13 2"></path>
                            </svg>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <defs>
                              <filter id="goo-12">
                                <fegaussianblur
                                  in="SourceGraphic"
                                  stdDeviation="4"
                                  result="blur"
                                ></fegaussianblur>
                                <fecolormatrix
                                  in="blur"
                                  mode="matrix"
                                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                  result="goo-12"
                                ></fecolormatrix>
                                <feblend
                                  in="SourceGraphic"
                                  in2="goo-12"
                                ></feblend>
                              </filter>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <label htmlFor={option.text + index + message.poll._id}>
                        {option.text}
                      </label>
                    </div>
                  );
                })}
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
                <div className="flex-grow break-words break-all flex gap-2 items-center">
                  {message.referenceMessageId.imageUrl && (
                    <img
                      className="h-[16px]"
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
  isActiveContextMenu: PropTypes.bool,
  contextMenuPosition: PropTypes.shape({
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onContextMenu: PropTypes.func.isRequired,
  onClearContextMenu: PropTypes.func.isRequired,
};
