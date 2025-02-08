import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AsideChat({ chat }) {
  const { activeChat } = useSelector((state) => state.chat);

  let condition;

  if (chat?.more) {
    condition =
      activeChat?._id === chat?._id &&
      activeChat?.more?.createdAt === chat?.more?.createdAt;
  } else condition = activeChat?._id === chat?._id;

  if (chat.message === "1234442") console.log(chat, activeChat);

  return (
    <Link
      to={`/${chat._id}`}
      className={`flex items-center gap-5 text-white p-2 rounded-xl transition-all cursor-pointer ${
        condition ? "bg-[#8675DC] hover:bg-[#8765DC]" : "hover:bg-[#353535]"
      }`}
    >
      {chat.imageUrl ? (
        <img
          src={`http://localhost:3000/${chat.imageUrl}`}
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
        <p className="font-semibold text-lg">{chat.name}</p>
        <div className="text-[#ccc] line-clamp-1">
          {chat.message ? (
            <p>{chat.message}</p>
          ) : chat.lastMessage ? (
            <p>
              <span className="font-semibold text-white">
                {chat.lastMessage.sender.firstName}
              </span>
              : {chat.lastMessage.message}
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
};
