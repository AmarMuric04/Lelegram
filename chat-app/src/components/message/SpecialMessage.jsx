import { useDispatch } from "react-redux";
import { resetMessage } from "../../store/redux/messageSlice";
import PropTypes from "prop-types";

export default function SpecialMessage({ message, topMessage, icon }) {
  const dispatch = useDispatch();

  return (
    <div className="ml-[6px] interactInputAnimation absolute bg-[#252525] flex gap-4 px-4 py-2 left-0 w-[89%] z-10 h-full rounded-2xl items-center rounded-b-none">
      {icon}

      <div className="bg-[#8675DC20] w-full px-2 text-sm rounded-md border-l-4 border-[#8675DC]">
        <p className="text-[#8675DC]">{topMessage}</p>
        <div className="text-[#ccc] line-clamp-1 flex items-end gap-2">
          {message.imageUrl && (
            <img
              className="max-h-[16px]"
              src={`http://localhost:3000/${message.imageUrl}`}
            />
          )}
          {message.type === "poll" && "📊 " + message.poll.question}
          {message.referenceMessageId
            ? message.referenceMessageId.message
              ? message.referenceMessageId.message
              : message.message
            : message.message}
        </div>
      </div>
      <button
        onClick={() => {
          dispatch(resetMessage());
        }}
        className="hover:bg-[#8675DC20] cursor-pointer transition-all p-2 text-[#8675DC] rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M20 20L4 4m16 0L4 20"
          />
        </svg>
      </button>
    </div>
  );
}

SpecialMessage.propTypes = {
  message: PropTypes.string.isRequired,
  topMessage: PropTypes.string.isRequired,
  icon: PropTypes.node,
};
