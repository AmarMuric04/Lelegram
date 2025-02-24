import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useCreateDirectMessage from "../../../hooks/useCreateDirectMessage";

export default function ForwardMessage({ message }) {
  const { isSelecting } = useSelector((state) => state.message);
  const navigate = useNavigate();
  const { createDirectMessage } = useCreateDirectMessage();

  let otherUser;
  let displayName = message.referenceMessageId.chat?.name;

  if (
    message.referenceMessageId.chat?.type === "private" &&
    Array.isArray(message.referenceMessageId.chat?.users)
  ) {
    otherUser = message.referenceMessageId.chat?.users.find(
      (u) => String(u?._id) !== String(message?.sender?._id)
    );
  }

  if (otherUser && otherUser.firstName && otherUser.lastName) {
    displayName = `${otherUser.firstName} ${otherUser.lastName}`;
  } else if (message.referenceMessageId.chat?.name) {
    displayName = message.referenceMessageId.chat.name;
  } else {
    displayName = "Unknown";
  }

  console.log(message);

  return (
    <div
      className={`${isSelecting && "pointer-events-none"}`}
      onClick={() => {
        if (!otherUser) navigate("/k/" + message.referenceMessageId.chat?._id);
        else createDirectMessage({ userId: otherUser._id });
      }}
    >
      <div
        className={`text-sm cursor-pointer transition-all px-2 py-1 rounded-md`}
      >
        <p className="font-semibold">Forwarded from</p>
        <div className="flex items-center gap-1">
          {otherUser?.imageUrl && (
            <img
              src={`${otherUser.imageUrl}`}
              alt={displayName}
              className="min-h-6 max-h-6 min-w-6 max-w-6 rounded-full object-cover"
            />
          )}
          {!otherUser && message.referenceMessageId.chat?.imageUrl && (
            <img
              src={`${message.referenceMessageId.chat.imageUrl}`}
              alt={displayName}
              className="min-h-6 max-h-6 min-w-6 max-w-6 rounded-full object-cover"
            />
          )}
          {!otherUser && !message.referenceMessageId.chat?.imageUrl && (
            <div
              className="h-6 w-6 rounded-full text-[0.5rem] grid place-items-center font-semibold text-white"
              style={{
                background: message.referenceMessageId.chat
                  ? `linear-gradient(${
                      message.referenceMessageId.chat?.gradient?.direction
                    }, ${message.referenceMessageId.chat?.gradient?.colors.join(
                      ", "
                    )})`
                  : "darkred",
              }}
            >
              {otherUser
                ? otherUser.firstName?.slice(0, 1) +
                  otherUser.lastName?.slice(0, 1)
                : "x"}
            </div>
          )}
          <p>{displayName}</p>
        </div>
      </div>
    </div>
  );
}

ForwardMessage.propTypes = {
  message: PropTypes.object.isRequired,
};
