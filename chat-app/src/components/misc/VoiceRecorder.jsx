import { useState, useRef } from "react";
import ActionButton from "../button/ActionButton";
import { MicrophoneSVG } from "../../../public/svgs";
import { useSelector } from "react-redux";

export default function VoiceRecorder() {
  const [isListening, setIsListening] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const token = localStorage.getItem("token");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });

      const formData = new FormData();
      formData.append("audioUrl", audioFile);
      formData.append("senderId", user._id);
      formData.append("chatId", activeChat._id);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_PORT}/message/send-voice-message`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
            body: formData,
          }
        );
        const result = await response.json();
        console.log("Upload Success:", result);
      } catch (error) {
        console.error("Upload Error:", error);
      }

      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setIsListening(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsListening(false);
  };

  return (
    <>
      {!isListening && (
        <ActionButton action={startRecording}>
          <MicrophoneSVG />
        </ActionButton>
      )}
      {isListening && (
        <ActionButton action={stopRecording}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="currentColor"
              d="M4.75 3A1.75 1.75 0 0 0 3 4.75v14.5c0 .966.784 1.75 1.75 1.75h14.5A1.75 1.75 0 0 0 21 19.25V4.75A1.75 1.75 0 0 0 19.25 3z"
            />
          </svg>
        </ActionButton>
      )}
    </>
  );
}
