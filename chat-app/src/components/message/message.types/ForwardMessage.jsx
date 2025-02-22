import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ForwardMessage({ message }) {
  const { isSelecting } = useSelector((state) => state.message);

  return (
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
              src={`${message.referenceMessageId.chat.imageUrl}`}
              alt={message.referenceMessageId.chat.name}
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
  );
}

ForwardMessage.propTypes = {
  message: PropTypes.object.isRequired,
};
