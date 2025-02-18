import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function ChatImage({ dimensions = 12 }) {
  const { activeChat } = useSelector((state) => state.chat);

  // Convert dimensions to pixels (assuming 1 unit = 0.25rem = 4px)
  const sizeInPx = dimensions * 4;

  return (
    <>
      {activeChat?.imageUrl ? (
        <img
          className="rounded-full object-cover"
          src={`http://localhost:3000/${activeChat.imageUrl}`}
          alt={activeChat.name}
          style={{
            minHeight: `${sizeInPx}px`,
            maxHeight: `${sizeInPx}px`,
            minWidth: `${sizeInPx}px`,
            maxWidth: `${sizeInPx}px`,
          }}
        />
      ) : (
        <div
          className="rounded-full text-xs grid place-items-center font-semibold text-white"
          style={{
            height: `${sizeInPx}px`,
            width: `${sizeInPx}px`,
            background: `linear-gradient(${
              activeChat?.gradient?.direction
            }, ${activeChat?.gradient?.colors.join(", ")})`,
          }}
        >
          {activeChat?.name?.slice(0, 3)}
        </div>
      )}
    </>
  );
}

ChatImage.propTypes = {
  dimensions: PropTypes.number,
};
