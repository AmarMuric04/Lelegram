import PropTypes from "prop-types";

export default function ReacToMessage({ message, isInChat, onReact }) {
  return (
    <div className="mx-1 my-2 flex-wrap inline-flex">
      {Object.entries(message.reactions)
        .filter(([, users]) => users.length > 0)
        .map(([emoji, users]) => (
          <p
            onClick={() => {
              if (isInChat) onReact({ emoji, message });
            }}
            className="py-1 px-3 m-[2px] bg-[#ffffff50] hover:bg-[#ffffff70] cursor-pointer rounded-lg"
            key={emoji}
          >
            {emoji} {users.length}
          </p>
        ))}
    </div>
  );
}

ReacToMessage.propTypes = {
  message: PropTypes.object.isRequired,
  isInChat: PropTypes.bool.isRequired,
  onReact: PropTypes.func.isRequired,
};
