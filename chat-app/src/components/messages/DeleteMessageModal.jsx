import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import { closeModal } from "../../store/modalSlice";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { resetMessage } from "../../store/messageSlice";

export default function DeleteMessageModal() {
  const { activeChat } = useSelector((state) => state.chat);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleDeleteMessage = async () => {
    try {
      let refIds = message._id;
      if (Array.isArray(message)) {
        refIds = message.map((m) => m._id);
      }
      const response = await fetch(
        "http://localhost:3000/message/delete-message",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            messageId: refIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Sending a message failed.");
      }

      dispatch(resetMessage);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: deleteMessage } = useMutation({
    mutationFn: handleDeleteMessage,
  });

  return (
    <Modal id="delete-message">
      <header className="flex items-center gap-5">
        {activeChat?.imageUrl ? (
          <img
            src={`http://localhost:3000/${activeChat.imageUrl}`}
            alt={activeChat.name}
            className="min-h-8 max-h-8 min-w-8 max-w-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="h-8 w-8 rounded-full text-xs grid place-items-center font-semibold text-white"
            style={{
              background: `linear-gradient(${
                activeChat?.gradient?.direction
              }, ${activeChat?.gradient?.colors.join(", ")})`,
            }}
          >
            {activeChat?.name?.slice(0, 3)}
          </div>
        )}
        <p className="font-semibold text-xl">
          Delete {Array.isArray && message?.length} message
          {Array.isArray(message) && message.length > 1 && "s"}
        </p>
      </header>
      <p className="mt-4 font-semibold">
        Are you sure you want to delete{" "}
        {Array.isArray(message) ? "these" : "this"} <br /> message
        {Array.isArray(message) && message.length > 1 && "s"}{" "}
        {Array.isArray(message) && "for everyone"}?
      </p>

      <div className="flex items-center justify-end">
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
            deleteMessage();
            dispatch(closeModal());
          }}
          sx={{
            backgroundColor: "transparent",
            color: "#f56565",
            padding: "16px",
            borderRadius: "12px",
          }}
          variant="contained"
        >
          DELETE
        </Button>
      </div>
    </Modal>
  );
}
