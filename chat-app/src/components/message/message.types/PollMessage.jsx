import PropTypes from "prop-types";
import PollOptionsList from "../../poll/PollOptionsList";
import { LightbulbSVG } from "../../../../public/svgs";
import { useSelector } from "react-redux";
import { protectedPostData } from "../../../utility/async";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function PollMessage({ message }) {
  const { user } = useSelector((state) => state.auth);
  const [votes, setVotes] = useState([]);

  const token = localStorage.getItem("token");

  const { mutate: addVote } = useMutation({
    mutationFn: () =>
      protectedPostData(
        "/poll/add-vote",
        {
          pollId: message.poll,
          options: votes,
        },
        token
      ),
  });

  const hasVoted = message.poll?.options.some((opt) =>
    opt.voters.includes(user._id)
  );

  const totalPollVotes = message.poll?.options.reduce(
    (a, b) => (a += b.votes),
    0
  );

  const votedOptions = message.poll?.options
    .filter((opt) => opt.voters.includes(user._id))
    .map((option) => option.text);

  return (
    <div className="min-w-[20rem] p-2">
      <p className="font-semibold">{message.poll.question}</p>
      <div className="text-sm flex items-center w-full">
        <p>
          {message.poll.settings.anonymousVoting && "Anonymous"}{" "}
          {message.poll.settings.quizMode ? " Quiz" : "Voting"}
        </p>

        {hasVoted && message.poll.settings.quizMode && (
          <button
            onClick={() => alert(message.poll.explanation)}
            className="self-end ml-auto cursor-pointer"
          >
            <LightbulbSVG />
          </button>
        )}
      </div>
      <PollOptionsList
        message={message}
        hasVoted={hasVoted}
        votedOptions={votedOptions}
        totalPollVotes={totalPollVotes}
        votes={votes}
        setVotes={setVotes}
        addVote={addVote}
      />
      {message.poll.settings.multipleAnswers && (
        <button
          onClick={() => addVote()}
          className="font-semibold w-full mt-4 cursor-pointer"
        >
          Vote
        </button>
      )}
    </div>
  );
}

PollMessage.propTypes = {
  message: PropTypes.object.isRequired,
};
