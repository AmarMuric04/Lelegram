import Poll from "../models/poll.js";
import { getSocket } from "../socket.js";

export const addVote = async (req, res, next) => {
  try {
    const { pollId, options } = req.body;
    const userId = req.userId;

    console.log(pollId, options);

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (!Array.isArray(options)) {
      return res.status(400).json({ message: "Options should be an array" });
    }

    const selectedOptions = poll.options.filter((opt) =>
      options.includes(opt.text)
    );

    if (selectedOptions.length !== options.length) {
      return res
        .status(400)
        .json({ message: "One or more options are invalid" });
    }

    if (!poll.settings.multipleAnswers) {
      const hasVoted = poll.options.some((opt) => opt.voters.includes(userId));
      if (hasVoted) {
        return res.status(400).json({ message: "You can only vote once" });
      }
    }

    selectedOptions.forEach((selectedOption) => {
      if (!selectedOption.voters.includes(userId)) {
        selectedOption.votes += 1;
        selectedOption.voters.push(userId);
      }
    });

    await poll.save();

    getSocket().emit("messageSent", { data: poll.chat });

    res.status(200).json({ message: "Vote added successfully", poll });
  } catch (err) {
    next(err);
  }
};
