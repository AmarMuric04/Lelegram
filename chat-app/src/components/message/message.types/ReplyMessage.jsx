import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ReplyMessage({ message, isMe }) {
  const { isSelecting } = useSelector((state) => state.message);

  console.log(message);

  return (
    <Link
      className={`${isSelecting && "pointer-events-none"}`}
      to={`/k/${message.chat._id}#${message.referenceMessageId._id}`}
    >
      <div
        className={`mx-2 text-sm cursor-pointer transition-all ${
          isMe
            ? "hover:bg-[#ffffff40] bg-[#ffffff20] border-white"
            : "hover:bg-[#8675DC40] bg-[#8675DC20] border-[#8675DC]"
        } ${isMe ? "border-l-4" : "border-r-4"} px-2 py-1 rounded-md`}
      >
        <p className="font-semibold">
          {message.referenceMessageId.sender?.firstName}
        </p>
        <div className="flex items-center gap-2">
          {message.referenceMessageId.imageUrl && (
            <img
              className="max-h-[16px]"
              alt="image"
              src={`${message.referenceMessageId.imageUrl}`}
            />
          )}
          <p className="line-clamp-2">
            {message.referenceMessageId.message &&
              message.referenceMessageId.message}
            {message.referenceMessageId.type === "voice" && "🔊 " + "Audio"}
            {message.referenceMessageId.type === "poll" &&
              "📊 " + message.referenceMessageId.poll.question}
          </p>
        </div>
      </div>
    </Link>
  );
}

ReplyMessage.propTypes = {
  message: PropTypes.object.isRequired,
  isMe: PropTypes.bool.isRequired,
};
