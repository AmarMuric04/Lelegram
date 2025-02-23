import PropTypes from "prop-types";
import { getFormattedTimeAMPM } from "../../../utility/util";
import { useSelector } from "react-redux";

export default function NormalMessage({ message }) {
  const { timeFormat } = useSelector((state) => state.userSettings);

  return (
    <div
      style={{ whiteSpace: "pre-wrap" }}
      className="flex flex-wrap  justify-end items-baseline px-2 py-1"
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

      <div className="flex-shrink-0 flex gap-2 whitespace-nowrap text-xs theme-text-2 ml-2">
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
};
