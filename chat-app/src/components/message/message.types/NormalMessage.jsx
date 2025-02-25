import PropTypes from "prop-types";
import { getFormattedTimeAMPM } from "../../../utility/util";
import { useSelector } from "react-redux";

export default function NormalMessage({ message, isMe }) {
  const { timeFormat } = useSelector((state) => state.userSettings);

  return (
    <div
      style={{ whiteSpace: "pre-wrap" }}
      className="flex justify-end items-end flex-wrap px-2 py-1"
    >
      {message.message &&
        message.type !== "forward" &&
        message.type !== "poll" && (
          <p className="flex-grow">{message.message}</p>
        )}
      {message.type === "forward" && (
        <div className="flex items-center gap-2">
          {message.referenceMessageId.imageUrl && (
            <img
              className="max-h-[16px]"
              src={`${message.referenceMessageId.imageUrl}`}
            />
          )}
          <p className="line-clamp-2">
            {message.referenceMessageId.message &&
              message.referenceMessageId.message}
            {message.referenceMessageId.type === "voice" && (
              <audio controls>
                <source
                  src={message.referenceMessageId.audioUrl}
                  type="audio/mp3"
                />
                Your browser does not support the audio element.
              </audio>
            )}
            {message.referenceMessageId.type === "poll" &&
              "📊 " + message.referenceMessageId.poll.question}
          </p>
        </div>
      )}
      {message.type === "voice" && (
        <audio controls>
          <source src={message.audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}

      <div className="flex-shrink-0 flex items-end gap-2 whitespace-nowrap text-xs theme-text-2 ml-2">
        {message.chat.type !== "private" && message.seenBy?.length > 0 && (
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="text-[#ccc]"
            >
              <rect width="24" height="24" fill="none" />
              <path
                fill="currentColor"
                d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
              />
            </svg>
            <p>{message.seenBy.length}</p>
          </div>
        )}
        {message.chat.type === "private" && message.seenBy?.length === 2 && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 512 512"
            className={`${isMe ? "theme-text" : "text-[#8675DC]"}`}
          >
            <rect width="512" height="512" fill="none" />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
              d="M464 128L240 384l-96-96m0 96l-96-96m320-160L232 284"
            />
          </svg>
        )}
        {message.chat.type === "private" && message.seenBy?.length < 2 && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="currentColor"
              d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39l8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33Z"
            />
          </svg>
        )}
        {message.edited && message.type !== "forward" && (
          <p className="italic">edited</p>
        )}
        <p>
          {getFormattedTimeAMPM(
            new Date(message.createdAt),
            timeFormat === "24hours"
          )}
        </p>
      </div>
    </div>
  );
}

NormalMessage.propTypes = {
  message: PropTypes.object.isRequired,
  isMe: PropTypes.any,
};
