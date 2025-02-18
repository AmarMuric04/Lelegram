import { useState } from "react";
import Modal from "../Modal";
import { closeModal } from "../../store/redux/modalSlice.js";
import { CrossSVG } from "../../../public/svgs";
import { Button } from "@mui/material";
import { setMessageType } from "../../store/redux/messageSlice.js";
import Input from "../Input";
import { useDispatch } from "react-redux";
import { PollSettings } from "./PollSettings.jsx";
import { useMessageContext } from "../../store/context/MessageProvider.jsx";

export default function PollModal() {
  const { sendMessage, isSendingMessage } = useMessageContext();

  const [poll, setPoll] = useState({
    question: "",
    explanation: "",
    correctAnswer: "",
    options: [""],
    settings: {
      anonymousVoting: false,
      multipleVotes: false,
      quizMode: false,
    },
  });

  const dispatch = useDispatch();

  const handleResetPoll = () => {
    setPoll({
      ...poll,
      explanation: "",
      options: [""],
      question: "",
      settings: {
        anonymousVoting: false,
        quizMode: false,
        multipleAnswers: false,
      },
    });
  };

  return (
    <Modal
      extraClasses="max-h-[40rem] overflow-auto w-[30rem] py-8"
      id="send-poll"
    >
      <header className="flex justify-between items-center text-lg font-semibold">
        <div className="flex gap-10 items-center">
          <button
            onClick={() => {
              handleResetPoll();
              dispatch(closeModal());
            }}
            className="hover:bg-[#303030] cursor-pointer transition-all p-2 rounded-full"
          >
            <CrossSVG />
          </button>
          <h1>New Poll</h1>
        </div>

        <Button
          disabled={
            !poll.question ||
            poll.options.filter((opt) => opt.trim() !== "").length < 2 ||
            new Set(poll.options.filter((opt) => opt.trim() !== "")).size !==
              poll.options.filter((opt) => opt.trim() !== "").length ||
            (poll.settings.quizMode &&
              (!poll.correctAnswer || !poll.explanation))
          }
          onClick={() => {
            dispatch(setMessageType("poll"));
            sendMessage({ poll });

            handleResetPoll();
            dispatch(closeModal());
          }}
          sx={{
            backgroundColor: "#8675DC",
            padding: "4px",
            borderRadius: "8px",
            width: "30%",
          }}
          variant="contained"
        >
          {isSendingMessage ? "CREATING..." : "CREATE"}
        </Button>
      </header>
      <Input
        inputValue={poll.question}
        value={poll.question}
        onChange={(e) => setPoll({ ...poll, question: e.target.value })}
        textClass="bg-[#151515]"
      >
        Ask a Question
      </Input>
      <h1 className="my-4 font-bold  text-[#ccc]">Poll options</h1>
      {poll.options.map((opt, index) => (
        <div className="flex items-center gap-4 w-full" key={index}>
          {poll.settings.quizMode && opt !== "" && (
            <div
              onClick={() => setPoll({ ...poll, correctAnswer: opt })}
              className="checkbox-wrapper-12 mt-4"
            >
              <div className="cbx">
                <input
                  checked={poll.correctAnswer === opt}
                  id={opt}
                  type="checkbox"
                />
                <label htmlFor={opt}></label>
                <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                  <path d="M2 8.36364L6.23077 12L13 2"></path>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                  <filter id="goo-12">
                    <fegaussianblur
                      in="SourceGraphic"
                      stdDeviation="4"
                      result="blur"
                    ></fegaussianblur>
                    <fecolormatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                      result="goo-12"
                    ></fecolormatrix>
                    <feblend in="SourceGraphic" in2="goo-12"></feblend>
                  </filter>
                </defs>
              </svg>
            </div>
          )}
          <Input
            inputValue={opt}
            value={opt}
            onChange={(e) => {
              setPoll((prev) => {
                const newOptions = [...prev.options];
                newOptions[index] = e.target.value;

                if (
                  index === newOptions.length - 1 &&
                  e.target.value.trim() !== ""
                ) {
                  if (newOptions.length === 10) return prev;
                  newOptions.push("");
                }

                return { ...prev, options: newOptions };
              });
            }}
            textClass="bg-[#151515]"
          >
            Add an Option
          </Input>
        </div>
      ))}
      <h1 className="my-4 font-bold text-[#ccc]">Settings</h1>
      <PollSettings poll={poll} setPoll={setPoll} />
      {poll.settings.quizMode && (
        <div>
          <h1 className="my-4 font-bold text-[#ccc]">Explanation</h1>
          <Input
            inputValue={poll.explanation}
            onChange={(e) => setPoll({ ...poll, explanation: e.target.value })}
            textClass="bg-[#151515]"
          >
            Add an explanation
          </Input>
          <p className="mt-4 text-[#ccc] text-sm">
            Users will see this text after choosing the wrong answer, good for
            educational purposes.
          </p>
        </div>
      )}
    </Modal>
  );
}
