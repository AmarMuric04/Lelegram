import PropTypes from "prop-types";
import PollOption from "./PollOption";

const PollOptionsList = ({
  message,
  hasVoted,
  votedOptions,
  totalPollVotes,
  votes,
  setVotes,
  addVote,
}) =>
  message.poll.options.map((option, index) => (
    <PollOption
      key={option.text + index + message.poll._id}
      option={option}
      index={index}
      message={message}
      hasVoted={hasVoted}
      votedOptions={votedOptions}
      totalPollVotes={totalPollVotes}
      votes={votes}
      setVotes={setVotes}
      addVote={addVote}
    />
  ));

export default PollOptionsList;

PollOptionsList.propTypes = {
  message: PropTypes.object.isRequired,
  hasVoted: PropTypes.bool.isRequired,
  votedOptions: PropTypes.array.isRequired,
  totalPollVotes: PropTypes.number.isRequired,
  votes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  setVotes: PropTypes.func.isRequired,
  addVote: PropTypes.func.isRequired,
};
