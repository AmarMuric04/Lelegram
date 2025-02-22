import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_PORT);

export default function VoiceChat() {
  const [isCalling, setIsCalling] = useState(false);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteAudio = useRef(null);

  useEffect(() => {
    socket.on("offer", async (offer) => {
      if (!peerConnection.current) createPeerConnection();
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await peerConnection.current.addIceCandidate(candidate);
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  const createPeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.ontrack = (event) => {
      if (remoteAudio.current) {
        remoteAudio.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };
  };

  const startCall = async () => {
    await createPeerConnection();
    localStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", offer);

    setIsCalling(true);
  };

  const endCall = () => {
    peerConnection.current?.close();
    peerConnection.current = null;
    localStream.current?.getTracks().forEach((track) => track.stop());
    setIsCalling(false);
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="p-4">
      {!isCalling ? (
        <button
          onClick={startCall}
          className="theme-hover-bg-2 cursor-pointer transition-all p-2 text-white rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="theme-text-2"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="none"
              stroke="currentColor"
              strokeDasharray="64"
              strokeDashoffset="64"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 3c0.5 0 2.5 4.5 2.5 5c0 1 -1.5 2 -2 3c-0.5 1 0.5 2 1.5 3c0.39 0.39 2 2 3 1.5c1 -0.5 2 -2 3 -2c0.5 0 5 2 5 2.5c0 2 -1.5 3.5 -3 4c-1.5 0.5 -2.5 0.5 -4.5 0c-2 -0.5 -3.5 -1 -6 -3.5c-2.5 -2.5 -3 -4 -3.5 -6c-0.5 -2 -0.5 -3 0 -4.5c0.5 -1.5 2 -3 4 -3Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.6s"
                values="64;0"
              />
            </path>
          </svg>
        </button>
      ) : (
        <button className="hover:bg-green-500/40 bg-green-500/20 cursor-pointer transition-all p-2 text-white rounded-full">
          <svg
            onClick={endCall}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-green-500"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="none"
              stroke="currentColor"
              strokeDasharray="64"
              strokeDashoffset="64"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 3c0.5 0 2.5 4.5 2.5 5c0 1 -1.5 2 -2 3c-0.5 1 0.5 2 1.5 3c0.39 0.39 2 2 3 1.5c1 -0.5 2 -2 3 -2c0.5 0 5 2 5 2.5c0 2 -1.5 3.5 -3 4c-1.5 0.5 -2.5 0.5 -4.5 0c-2 -0.5 -3.5 -1 -6 -3.5c-2.5 -2.5 -3 -4 -3.5 -6c-0.5 -2 -0.5 -3 0 -4.5c0.5 -1.5 2 -3 4 -3Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.6s"
                values="64;0"
              />
            </path>
          </svg>
        </button>
      )}

      <audio ref={remoteAudio} autoPlay />
    </div>
  );
}
