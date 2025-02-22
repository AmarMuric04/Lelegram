import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function ChatImage({ dimensions = 12 }) {
  const { activeChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const sizeInPx = dimensions * 4;

  let displayImageUrl = activeChat.imageUrl;

  if (
    activeChat.type === "private" &&
    Array.isArray(activeChat.users) &&
    user
  ) {
    const otherUser = activeChat?.users.find(
      (u) => u?._id.toString() !== user._id.toString()
    );
    if (otherUser) {
      displayImageUrl = otherUser.imageUrl;
    }
  }

  return (
    <>
      {activeChat?.type === "private" || activeChat?.imageUrl ? (
        <img
          className="rounded-full object-cover"
          src={`${displayImageUrl}`}
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
