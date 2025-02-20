import { useDispatch, useSelector } from "react-redux";
import ChatImage from "../ChatImage";
import PopUpMenu from "../../misc/PopUpMenu";
import { SelectSVG, TrashSVG, VerticalDotsSVG } from "../../../../public/svgs";
import PopUpMenuItem from "../../misc/PopUpMenuItem";
import { setSelected } from "../../../store/redux/authSlice";
import { setIsSelecting } from "../../../store/redux/messageSlice";
import { openModal } from "../../../store/redux/modalSlice";
import PropTypes from "prop-types";

export default function ActiveChatHeader({ setViewChatInfo }) {
  const { activeChat } = useSelector((state) => state.chat);
  const { isSelecting } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isInChat = activeChat?.users?.some(
    (u) => u._id.toString() === user._id
  );

  const isAdmin = activeChat?.admins?.some(
    (u) => u._id.toString() === user._id
  );

  let displayName = activeChat.name;

  if (
    activeChat.type === "private" &&
    Array.isArray(activeChat.users) &&
    user
  ) {
    const otherUser = activeChat.users.find(
      (u) => u.toString() !== user._id.toString()
    );
    if (otherUser) {
      displayName = `${otherUser.firstName} ${otherUser.lastName}`;
    }
  }

  return (
    <header
      onClick={() => setViewChatInfo(true)}
      className="relative z-210 border-x-2 border-[#151515] bg-[#252525] w-full px-5 py-2 flex justify-between items-center gap-5 h-[5%] cursor-pointer"
    >
      <div className="flex gap-5 items-center">
        <ChatImage dimensions={10} />
        <div>
          <p className="font-semibold">{displayName}</p>
          <p className="text-[#ccc] text-sm -mt-1">
            {activeChat?.type === "private" && "Last seen recently"}
            {activeChat?.type !== "private" &&
              `${activeChat.users.length} member ${
                activeChat.users.length > 1 && "s"
              }`}
          </p>
        </div>
      </div>
      <div className="flex gap-20">
        {activeChat.pinnedMessage && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="text-sm border-l-2 border-[#8675DC] px-4"
          >
            <p className="text-[#8675DC]">Pinned Message</p>
            <div className="flex gap-2">
              <p>{activeChat.pinnedMessage.sender.firstName}: </p>
              <p className="line-clamp-1 max-w-[10rem] truncate whitespace-nowrap overflow-hidden">
                {activeChat.pinnedMessage.message
                  ? activeChat.pinnedMessage.message
                  : activeChat.pinnedMessage.referenceMessageId.message}
              </p>
            </div>
          </div>
        )}

        {activeChat.type !== "saved" && (
          <PopUpMenu
            bl={true}
            icon={<VerticalDotsSVG />}
            buttonClasses={
              "hover:bg-[#303030] cursor-pointer transition-all p-2 text-white rounded-full"
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
                <p className="font-semibold flex-shrink-0">Clear selection</p>
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
                <p className="font-semibold flex-shrink-0">Select Messages</p>
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
    </header>
  );
}

ActiveChatHeader.propTypes = {
  setViewChatInfo: PropTypes.func,
};
