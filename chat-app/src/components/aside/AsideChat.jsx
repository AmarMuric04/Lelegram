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

  if (!user || !user._id) return;

  let displayName = chat.name;
  let displayImageUrl = chat.imageUrl;

  if (chat.type === "private" && Array.isArray(chat.users) && user) {
    const otherUser = chat.users.find(
      (u) => u?._id.toString() !== user._id.toString()
    );
    if (otherUser) {
      displayName = `${otherUser.firstName} ${otherUser.lastName}`;
      displayImageUrl = otherUser.imageUrl;
    }
  }

  return (
    <Link
      onClick={action}
      to={`/k/${link}`}
      className={`flex theme-text relative items-center gap-5 p-2 rounded-xl transition-all cursor-pointer ${
        condition ? "bg-[#8675DC] hover:bg-[#8765DC]" : "theme-hover-bg-2"
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
            src={`${displayImageUrl}`}
            alt={displayName}
            className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full object-cover"
          />
        ) : (
          <div
            className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full grid place-items-center font-semibold "
            style={{
              background: `linear-gradient(${
                chat.gradient?.direction || "to right"
              }, ${chat.gradient?.colors?.join(", ") || "#ccc"})`,
            }}
          >
            {displayName?.slice(0, 3)}
          </div>
        )
      ) : chat.imageUrl ? (
        <img
          src={`${chat.imageUrl}`}
          alt={chat.name}
          className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full object-cover"
        />
      ) : (
        <div
          className="min-h-14 max-h-14 min-w-14 max-w-14 rounded-full grid place-items-center font-semibold "
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
        <div
          className={` line-clamp-1 ${
            activeChat?._id === chat._id ? "text-white" : "theme-text-2"
          }`}
        >
          {chat.message ? (
            <p>{chat.message}</p>
          ) : chat.lastMessage ? (
            <p>
              <span className="font-semibold ">
                {chat.lastMessage.sender?.firstName}
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
