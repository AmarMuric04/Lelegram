import { useDispatch, useSelector } from "react-redux";
import ChatImage from "../ChatImage";
import PopUpMenu from "../../misc/PopUpMenu";
import { SelectSVG, TrashSVG, VerticalDotsSVG } from "../../../../public/svgs";
import PopUpMenuItem from "../../misc/PopUpMenuItem";
import { setSelected } from "../../../store/redux/messageSlice";
import { setIsSelecting } from "../../../store/redux/messageSlice";
import { openModal } from "../../../store/redux/modalSlice";
import PropTypes from "prop-types";
import { getRecentTime } from "../../../utility/util";
import MediaRoom from "../../misc/VoiceChat";
import { useState } from "react";

export default function ActiveChatHeader({ setViewChatInfo }) {
  const { activeChat } = useSelector((state) => state.chat);
  const { isSelecting } = useSelector((state) => state.message);
  const [openVoiceChat, setOpenVoiceChat] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isInChat = activeChat?.users?.some(
    (u) => u._id.toString() === user._id
  );

  const isAdmin = activeChat?.admins?.some(
    (u) => u._id.toString() === user._id
  );

  let displayName = activeChat.name;
  let otherUser;

  if (
    activeChat.type === "private" &&
    Array.isArray(activeChat.users) &&
    user
  ) {
    otherUser = activeChat?.users.find(
      (u) => u?._id.toString() !== user._id.toString()
    );
    if (otherUser) {
      displayName = `${otherUser.firstName} ${otherUser.lastName}`;
    }
  }

  return (
    <header
      onClick={() => {
        if (openVoiceChat) return;
        setViewChatInfo(true);
      }}
      className={`absolute z-20 border-x-2 sidepanel w-full px-5 py-2 flex flex-col gap-5 cursor-pointer theme-text transition-all ${
        activeChat.type !== "broadcast" && openVoiceChat
          ? "min-h-screen"
          : "h-[5%]"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center h-full">
          <ChatImage dimensions={10} />
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className="theme-text-2 text-sm -mt-1">
              {activeChat?.type === "private" && (
                <p className="theme-text-2 text-sm">
                  {otherUser.lastSeen
                    ? `last seen ${getRecentTime(otherUser.lastSeen)}`
                    : "online"}
                </p>
              )}
              {activeChat?.type !== "private" &&
                `${activeChat.users?.length} member${
                  activeChat.users?.length > 1 ? "s" : ""
                }`}
            </p>
          </div>
        </div>
        <div className="flex gap-20 h-full">
          {activeChat.pinnedMessage && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-sm border-l-2 border-[#8675DC] px-4"
            >
              <p className="text-[#8675DC]">Pinned Message</p>
              <div className="flex gap-2 line-clamp-1">
                <p>{activeChat.pinnedmessage.sender?.firstName}: </p>
                <p className="line-clamp-1 max-w-[10rem] truncate whitespace-nowrap overflow-hidden">
                  {activeChat.pinnedMessage.message
                    ? activeChat.pinnedMessage.message
                    : activeChat.pinnedMessage.referenceMessageId.message}
                </p>
              </div>
            </div>
          )}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-8"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenVoiceChat(true);
              }}
              className="theme-hover-bg-2 cursor-pointer transition-all p-2  rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="theme-text-2"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M18.118 14.702L14 15.5c-2.782-1.396-4.5-3-5.5-5.5l.77-4.13L7.815 2H4.064c-1.128 0-2.016.932-1.847 2.047c.42 2.783 1.66 7.83 5.283 11.453c3.805 3.805 9.286 5.456 12.302 6.113c1.165.253 2.198-.655 2.198-1.848v-3.584z"
                />
              </svg>
            </button>

            {activeChat.type !== "saved" && (
              <PopUpMenu
                bl={true}
                icon={<VerticalDotsSVG />}
                buttonClasses={
                  "theme-hover-bg-2 cursor-pointer transition-all p-2  rounded-full"
                }
              >
                {isSelecting && (
                  <PopUpMenuItem
                    action={(e) => {
                      e.stopPropagation();
                      dispatch(setSelected([]));
                      dispatch(setIsSelecting(false));
                    }}
                  >
                    <SelectSVG />
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
                    <SelectSVG />
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
                    <TrashSVG />
                    <p className="font-semibold flex-shrink-0">
                      {isAdmin ? "Delete Channel" : "Leave Channel"}
                    </p>
                  </PopUpMenuItem>
                )}
              </PopUpMenu>
            )}
          </div>
        </div>
      </div>
      {activeChat.type !== "broadcast" && openVoiceChat && (
        <div className="h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <MediaRoom
            chatId={activeChat._id}
            video={false}
            audio={true}
            user={user}
            onUserLeft={() => setOpenVoiceChat(false)}
          />
        </div>
      )}
    </header>
  );
}

ActiveChatHeader.propTypes = {
  setViewChatInfo: PropTypes.func,
};
