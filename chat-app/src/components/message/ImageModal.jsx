import { useState } from "react";
import Modal from "../modal/Modal";
import { closeModal } from "../../store/redux/modalSlice";
import { CrossSVG } from "../../../public/svgs";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "../../store/redux/imageSlice";
import { useMessageContext } from "../../store/context/MessageProvider";

export default function ImageModal() {
  const dispatch = useDispatch();
  const { sendMessage, isSendingMessage } = useMessageContext();

  const [caption, setCaption] = useState("");
  const { url, preview } = useSelector((state) => state.image);

  const handleResetMWI = () => {
    dispatch(setImage({ url: "", preview: null }));
    setCaption("");
  };

  return (
    <Modal id="send-photo">
      <header className="flex gap-10 items-center text-lg font-semibold">
        <button
          onClick={() => {
            handleResetMWI();
            dispatch(closeModal());
          }}
          className="hover:bg-[#303030] cursor-pointer transition-all p-2 rounded-full"
        >
          <CrossSVG />
        </button>
        <h1>Send Photo</h1>
      </header>
      {preview && (
        <img
          className="max-w-[20rem] mx-auto max-h-[20rem] my-4"
          src={preview}
        />
      )}

      <div className="flex gap-4">
        <input
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
          className="focus:outline-none py-2 w-full"
          placeholder="Add a caption..."
        />
        <Button
          onClick={() => {
            sendMessage({ msgImage: { url, preview, caption } });
            handleResetMWI();
            dispatch(closeModal());
          }}
          sx={{
            backgroundColor: "#8675DC",
            padding: "4px",
            borderRadius: "12px",
            width: "30%",
          }}
          variant="contained"
        >
          {isSendingMessage ? "SENDING..." : "SEND"}
        </Button>
      </div>
    </Modal>
  );
}
