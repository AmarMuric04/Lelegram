import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ForwardMessage({ message }) {
  const { isSelecting } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);

  let otherUser;
  let displayName = message.referenceMessageId.chat?.name;

  console.log(message);

  if (
    message.referenceMessageId.chat?.type === "private" &&
    Array.isArray(message.referenceMessageId.chat?.users)
  ) {
    otherUser = message.referenceMessageId.chat?.users.find(
      (u) => u.toString() !== user._id.toString()
    );
    console.log(otherUser);
  }

  if (otherUser) {
    displayName = `${otherUser.firstName} ${otherUser.lastName}`;
  }

  return (
    <Link
      className={`${isSelecting && "pointer-events-none"}`}
      to={`/k/${
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
          {otherUser?.imageUrl ? (
            <img
              src={`${otherUser.imageUrl}`}
              alt={displayName}
              className="min-h-6 max-h-6 min-w-6 max-w-6 rounded-full object-cover"
            />
          ) : (
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
    </Link>
  );
}

ForwardMessage.propTypes = {
  message: PropTypes.object.isRequired,
};
