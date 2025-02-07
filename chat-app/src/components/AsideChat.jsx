import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../store/chatSlice";

export default function AsideChat({ chat }) {
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);

  let condition;

  if (chat?.more) {
    condition =
      activeChat?._id === chat?._id &&
      activeChat?.more?.createdAt === chat?.more?.createdAt;
  } else condition = activeChat?._id === chat?._id;

  return (
    <li
      onClick={() => dispatch(setActiveChat(chat))}
      className={`flex items-center gap-5 text-white p-2 rounded-xl transition-all cursor-pointer ${
        condition ? "bg-[#8675DC] hover:bg-[#8765DC]" : "hover:bg-[#353535]"
      }`}
    >
      <div className="bg-orange-300 h-16 w-16 rounded-full grid place-items-center font-semibold">
        {chat.name.slice(0, 3)}
      </div>
      <div>
        <p className="font-semibold text-lg">{chat.name}</p>
        <p className="text-[#ccc]">
          {chat.message ? chat.message : "Channel created!"}
        </p>
      </div>
    </li>
  );
}

AsideChat.propTypes = {
  chat: PropTypes.object,
};
