import { useSelector } from "react-redux";
import Modal from "../Modal";
import { closeModal } from "../../store/modalSlice";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setActiveChat } from "../../store/chatSlice";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import ChatImage from "./ChatImage";

export default function LeaveChatModal({ isAdmin }) {
  const { activeChat } = useSelector((state) => state.chat);
  const userId = localStorage.getItem("userId");

  const [deleteForAll, setDeleteForAll] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const handleRemoveUserFromChat = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/remove-user/" + activeChat._id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Couldn't remove user from the chat.");
      }

      queryClient.invalidateQueries(["chats"]);
      dispatch(setActiveChat(null));
      dispatch(closeModal());

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: removeUserFromChat, removeUserIsPending } = useMutation({
    mutationFn: ({ userId }) => handleRemoveUserFromChat(userId),
    onSuccess: () => dispatch(closeModal()),
  });

  const handleDeleteChat = async () => {
    try {
      const response = await fetch("http://localhost:3000/chat/delete-chat", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ chatId: activeChat._id }),
      });

      if (!response.ok) {
        throw new Error("Deleting the chat failed.");
      }

      queryClient.invalidateQueries(["chats"]);
      dispatch(setActiveChat(null));
      dispatch(closeModal());

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { mutate: deleteChat } = useMutation({
    mutationFn: handleDeleteChat,
  });

  return (
    <Modal id="leave-channel">
      <header className="flex items-center gap-5">
        <ChatImage dimensions={8} />
        <p className="font-semibold text-xl">Delete channel</p>
      </header>
      <p className="mt-4 font-semibold">
        Do you want to delete and leave the <br /> channel?
      </p>
      {isAdmin && (
        <div className="checkbox-wrapper-4 w-full h-[4rem] flex items-center">
          <input
            onChange={() => setDeleteForAll(!deleteForAll)}
            className="inp-cbx"
            id="morning"
            type="checkbox"
          />
          <label
            className="cbx w-full h-full flex gap-8 items-center"
            htmlFor="morning"
          >
            <span>
              <svg width="12px" height="10px">
                <use xlinkHref="#check-4"></use>
              </svg>
            </span>
            <span className="font-normal">Delete for all subscribers</span>
          </label>
          <svg className="inline-svg">
            <symbol id="check-4" viewBox="0 0 12 10">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </symbol>
          </svg>
        </div>
      )}
      <div className="flex">
        <Button
          onClick={() => dispatch(closeModal())}
          sx={{
            backgroundColor: "transparent",
            color: "#8675DC",
            padding: "16px",
            borderRadius: "12px",
            width: "40%",
          }}
          variant="contained"
        >
          CANCEL
        </Button>
        <Button
          onClick={() => {
            if (deleteForAll) {
              deleteChat();
            } else removeUserFromChat({ userId });
          }}
          sx={{
            backgroundColor: "transparent",
            color: "#f56565",
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
          }}
          variant="contained"
        >
          {removeUserIsPending ? "PLEASE WAIT..." : "DELETE CHANNEL"}
        </Button>
      </div>
    </Modal>
  );
}

LeaveChatModal.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};
