import { useState } from "react";
import Modal from "../Modal";
import { closeModal } from "../../store/modalSlice";
import { CrossSVG } from "../../../public/svgs";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { setImage } from "../../store/imageSlice";

export default function ImageModal({ action }) {
  const dispatch = useDispatch();

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
            action({ msgImage: { url, preview, caption } });
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
          SEND
        </Button>
      </div>
    </Modal>
  );
}

ImageModal.propTypes = {
  action: PropTypes.func.isRequired,
};
