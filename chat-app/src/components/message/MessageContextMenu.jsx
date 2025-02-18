import { useDispatch, useSelector } from "react-redux";
import * as svg from "../../../public/svgs";
import {
  setForwardedChat,
  setIsSelecting,
  setMessage,
  setMessageToEdit,
  setMessageType,
  setSelected,
  startForwarding,
} from "../../store/redux/messageSlice";
import { openModal } from "../../store/redux/modalSlice";
import { copyToClipboard } from "../../utility/util";
import ContextMenu from "../context/ContextMenu";
import ContextMenuItem from "../context/ContextMenuItem";
import { setActiveChat } from "../../store/redux/chatSlice";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";

export default function MessageContextMenu({
  isAdmin,
  isMe,
  isSelected,
  message,
}) {
  const { isSelecting, selected } = useSelector((state) => state.message);
  const { activeChat } = useSelector((state) => state.chat);
  const { contextMenuInfo, open } = useSelector((state) => state.contextMenu);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

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

  return (
    <>
      {open && contextMenuInfo.message._id === message._id && (
        <ContextMenu>
          {isSelecting && !isSelected && (
            <ContextMenuItem
              action={() => dispatch(setSelected([...selected, message]))}
              icon={<svg.SelectSVG />}
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
                icon={<svg.CopySelectedSVG />}
              >
                Copy selected
              </ContextMenuItem>
              <ContextMenuItem
                action={() => {
                  dispatch(openModal("forward-to-channels"));
                  dispatch(startForwarding());
                }}
                icon={<svg.ForwardSVG dimension={20} />}
              >
                Forward selected
              </ContextMenuItem>
              <ContextMenuItem
                action={() => {
                  dispatch(setSelected([]));
                  dispatch(setIsSelecting(false));
                }}
                icon={<svg.SelectSVG />}
              >
                Clear selection
              </ContextMenuItem>
              {(isMe || isAdmin) && (
                <ContextMenuItem
                  action={() => {
                    dispatch(setMessage(message));
                    dispatch(openModal("delete-message"));
                  }}
                  icon={<svg.TrashSVG />}
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
                action={() => {
                  dispatch(setMessage(message));
                  dispatch(setMessageType("reply"));
                }}
                icon={<svg.ReplySVG dimension={20} />}
              >
                Reply
              </ContextMenuItem>
              <ContextMenuItem
                action={() => copyToClipboard(message.message)}
                icon={<svg.CopySelectedSVG />}
              >
                Copy
              </ContextMenuItem>
              {isAdmin && (
                <ContextMenuItem
                  action={pinMessage}
                  icon={
                    activeChat.pinnedMessage?._id !== message._id ? (
                      <svg.PinSVG />
                    ) : (
                      <svg.UnpinSVG />
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
                icon={<svg.ForwardSVG />}
              >
                Forward
              </ContextMenuItem>
              {!isMe && (
                <ContextMenuItem
                  action={() => {
                    dispatch(setMessage(message));
                    dispatch(setMessageType("reply"));
                  }}
                  icon={<svg.FlagSVG />}
                >
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
                icon={<svg.LinkSVG />}
              >
                Copy Message Link
              </ContextMenuItem>
              {isMe && message.type !== "forward" && (
                <ContextMenuItem
                  action={() => {
                    dispatch(setMessageToEdit(message));
                  }}
                  icon={<svg.EditSVG />}
                >
                  Edit
                </ContextMenuItem>
              )}
              <ContextMenuItem
                action={() => {
                  dispatch(setIsSelecting(true));
                  dispatch(setSelected([message]));
                }}
                icon={<svg.SelectSVG />}
              >
                Select
              </ContextMenuItem>
              {(isMe || isAdmin) && (
                <ContextMenuItem
                  action={() => {
                    dispatch(setMessage(message));
                    dispatch(openModal("delete-message"));
                  }}
                  icon={<svg.TrashSVG />}
                  buttonClasses="bg-red-500/20 text-red-500 hover:bg-red-500/40"
                >
                  Delete
                </ContextMenuItem>
              )}
            </>
          )}
        </ContextMenu>
      )}
    </>
  );
}

MessageContextMenu.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isMe: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,
};
