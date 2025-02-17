import PropTypes from "prop-types";
import Checkbox from "../Checkbox";

export function PollSettings({ poll, setPoll }) {
  return (
    <div className="flex flex-col gap-4 my-8">
      <Checkbox
        action={() =>
          setPoll((prev) => ({
            ...prev,
            settings: {
              ...prev.settings,
              anonymousVoting: !prev.settings.anonymousVoting,
            },
          }))
        }
        isChecked={poll.settings.anonymousVoting}
        name="anonymous-voting"
        extraText="Anonymous Voting"
      />

      <Checkbox
        action={() => {
          setPoll((prev) => ({
            ...prev,
            settings: {
              ...prev.settings,
              multipleAnswers: !prev.settings.multipleAnswers,
              quizMode: false,
            },
            explanation: "",
            question: "",
            correctAnswer: "",
          }));
        }}
        isChecked={poll.settings.multipleAnswers}
        name="multiple-answers"
        extraText="Multiple Answers"
      />

      <Checkbox
        action={() =>
          setPoll((prev) => ({
            ...prev,
            settings: {
              ...prev.settings,
              quizMode: !prev.settings.quizMode,
              multipleAnswers: false,
            },
          }))
        }
        isChecked={poll.settings.quizMode}
        name="quiz-mode"
        extraText="Quiz Mode"
      />

      <svg className="hidden">
        <symbol id="check-4" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
}

PollSettings.propTypes = {
  poll: PropTypes.shape({
    question: PropTypes.string.isRequired,
    explanation: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctAnswer: PropTypes.string,
    settings: PropTypes.shape({
      anonymousVoting: PropTypes.bool.isRequired,
      multipleAnswers: PropTypes.bool.isRequired,
      quizMode: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  setPoll: PropTypes.func.isRequired,
};
