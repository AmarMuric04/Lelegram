import PropTypes from "prop-types";
import { CheckmarkSVG, IncorrectSVG } from "../../../public/svgs";

const PollOption = ({
  option,
  index,
  message,
  hasVoted,
  votedOptions,
  totalPollVotes,
  votes,
  setVotes,
  addVote,
}) => {
  const isSelected = votedOptions.includes(option.text);
  const isCorrect = option.text === message.poll.correctAnswer;
  const isIncorrect =
    isSelected && message.poll.settings.quizMode && !isCorrect;
  const votePercentage = ((option.votes / totalPollVotes) * 100).toFixed(0);

  if (hasVoted) {
    return (
      <div className="flex gap-4 w-full h-[40px] mt-2">
        <div className="flex flex-col justify-between w-[10%] h-full">
          <p className="font-semibold text-sm self-end">{votePercentage}%</p>
          {isSelected ? (
            isIncorrect ? (
              <IncorrectSVG
                classes="bg-red-500 rounded-full p-[2px] self-end"
                dimensions={16}
              />
            ) : (
              <CheckmarkSVG classes="self-end" dimensions={16} />
            )
          ) : isCorrect ? (
            <CheckmarkSVG classes="self-end" dimensions={16} />
          ) : (
            <div className="h-[16px]"></div>
          )}
        </div>
        <div className="flex flex-col justify-between w-[90%] h-full">
          <p>{option.text}</p>
          <div
            className={`h-[3px] rounded-full transition-all ${
              isIncorrect ? "bg-red-500" : "bg-white"
            }`}
            style={{ width: `${votePercentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  const handleVote = () => {
    if (!message.poll.settings.multipleAnswers) {
      setVotes(votes === option.text ? [] : [option.text]);
      addVote();
    } else {
      setVotes(
        votes.includes(option.text)
          ? votes.filter((vote) => vote !== option.text)
          : [...votes, option.text]
      );
    }
  };

  return (
    <div
      className="flex items-center gap-2 my-4"
      key={option.text + index + message.poll._id}
    >
      <div onClick={handleVote} className="cursor-pointer">
        <div className="checkbox-wrapper-12">
          <div className="cbx">
            <input
              checked={
                Array.isArray(votes)
                  ? votes.includes(option.text)
                  : votes === option.text
              }
              id={option.text + index + message.poll._id}
              type="checkbox"
              readOnly
            />
            <label htmlFor={option.text + index + message.poll._id}></label>
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path d="M2 8.36364L6.23077 12L13 2"></path>
            </svg>
          </div>
        </div>
      </div>
      <label htmlFor={option.text + index + message.poll._id}>
        {option.text}
      </label>
    </div>
  );
};

export default PollOption;

PollOption.propTypes = {
  option: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
  hasVoted: PropTypes.bool.isRequired,
  votedOptions: PropTypes.array.isRequired,
  totalPollVotes: PropTypes.number.isRequired,
  votes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  setVotes: PropTypes.func.isRequired,
  addVote: PropTypes.func.isRequired,
};
