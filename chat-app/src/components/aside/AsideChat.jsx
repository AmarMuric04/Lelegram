import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AsideChat({ chat, action }) {
  const { activeChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  let condition;

  if (chat?.more) {
    condition =
      activeChat?._id === chat?._id &&
      activeChat?.more?.createdAt === chat?.more?.createdAt;
  } else condition = activeChat?._id === chat?._id;

  let link = chat._id;
  if (chat?.more) {
    link += "#" + chat.more._id;
  }

  let displayName = chat.name;
  let displayImageUrl = chat.imageUrl;

  if (chat.type === "private" && Array.isArray(chat.users) && user) {
    const otherUser = chat.users.find(
      (u) => u.toString() !== user._id.toString()
    );
    if (otherUser) {
      displayName = `${otherUser.firstName} ${otherUser.lastName}`;
      displayImageUrl = otherUser.imageUrl;
    }
  }

  return (
    <Link
      onClick={action}
      to={`/${link}`}
      className={`flex relative items-center gap-5 text-white p-2 rounded-xl transition-all cursor-pointer ${
        condition ? "bg-[#8675DC] hover:bg-[#8765DC]" : "hover:bg-[#353535]"
      }`}
    >
      {chat.missedCount > 0 && (
        <p className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#8675DC] h-6 w-6 grid place-items-center text-sm rounded-full font-bold">
          {chat.missedCount}
        </p>
      )}
      {chat.type === "private" ? (
        displayImageUrl ? (
          <img
            src={`${import.meta.env.VITE_SERVER_PORT}/${displayImageUrl}`}
            alt={displayName}
            className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full object-cover"
          />
        ) : (
          <div
            className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full grid place-items-center font-semibold text-white"
            style={{
              background: `linear-gradient(${
                chat.gradient?.direction || "to right"
              }, ${chat.gradient?.colors?.join(", ") || "#ccc"})`,
            }}
          >
            {displayName.slice(0, 3)}
          </div>
        )
      ) : chat.imageUrl ? (
        <img
          src={`${import.meta.env.VITE_SERVER_PORT}/${chat.imageUrl}`}
          alt={chat.name}
          className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full object-cover"
        />
      ) : (
        <div
          className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full grid place-items-center font-semibold text-white"
          style={{
            background: `linear-gradient(${
              chat.gradient.direction
            }, ${chat.gradient.colors.join(", ")})`,
          }}
        >
          {chat.name.slice(0, 3)}
        </div>
      )}

      <div>
        <p className="font-semibold text-lg">{displayName}</p>
        <div className="text-[#ccc] line-clamp-1">
          {chat.message ? (
            <p>{chat.message}</p>
          ) : chat.lastMessage ? (
            <p>
              <span className="font-semibold text-white">
                {chat.lastMessage.sender.firstName}
              </span>
              :{" "}
              {chat.lastMessage.referenceMessageId
                ? chat.lastMessage.referenceMessageId.message
                : chat.lastMessage.message}
            </p>
          ) : (
            "Channel created!"
          )}
        </div>
      </div>
    </Link>
  );
}

AsideChat.propTypes = {
  chat: PropTypes.object,
  action: PropTypes.func,
};
