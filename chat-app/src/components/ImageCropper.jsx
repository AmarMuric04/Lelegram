import PropTypes from "prop-types";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../getCroppedImg";
import { useDispatch } from "react-redux";
import { closeModal } from "../store/modalSlice";

export default function ImageCropper({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const dispatch = useDispatch();

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

    onCropComplete(croppedImage);

    dispatch(closeModal());
  };

  return (
    <div className="relative px-8">
      <div className="flex items-center gap-10 font-semibold text-lg text-white mb-4">
        <svg
          onClick={() => dispatch(closeModal())}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M20 20L4 4m16 0L4 20"
          />
        </svg>
        <h1>Drag to Reposition</h1>
      </div>

      <div className="relative min-h-[20rem] min-w-[20rem]">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          cropShape="round"
          showGrid={false}
        />
      </div>

      <button
        onClick={handleConfirmCrop}
        className="bg-[#8675DC] z-50 cursor-pointer hover:bg-[#8765DC] transition-all p-4 text-white rounded-full float-right relative -right-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M416 128L192 384l-96-96"
          />
        </svg>
      </button>
    </div>
  );
}

ImageCropper.propTypes = {
  imageSrc: PropTypes.any,
  onCropComplete: PropTypes.func.isRequired,
};
