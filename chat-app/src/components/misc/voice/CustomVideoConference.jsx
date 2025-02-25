import React, { useEffect, useRef, useState } from "react";
import {
  useParticipants,
  useTracks,
  ParticipantTile,
  useChat,
  useRoomContext,
  TrackToggle,
} from "@livekit/components-react";
import { LocalVideoTrack, Track } from "livekit-client";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";

function ScreenShareButton() {
  const room = useRoomContext();
  const [isScreenSharing, setScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        // Request the screen capture stream
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const [videoTrack] = stream.getVideoTracks();
        // Create a LiveKit local video track from the captured stream
        const localScreenTrack = new LocalVideoTrack(videoTrack, {
          name: "screen",
        });

        // Publish the screen track to the room
        await room.localParticipant.publishTrack(localScreenTrack);
        setScreenTrack(localScreenTrack);
        setScreenSharing(true);
      } catch (error) {
        console.error("Error starting screen share:", error);
      }
    } else {
      // Stop screen sharing by unpublishing and stopping the track
      if (screenTrack) {
        await room.localParticipant.unpublishTrack(screenTrack);
        screenTrack.stop();
      }
      setScreenSharing(false);
      setScreenTrack(null);
    }
  };

  return (
    <button
      onClick={toggleScreenShare}
      className={`relative bottom-0 float-right z-50 w-[3.5rem] h-[3.5rem] grid place-items-center rounded-full theme-bg theme-hover-bg-2 transition-all cursor-pointer ${
        !isScreenSharing ? "muted" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <rect width="24" height="24" fill="none" />
        <path
          fill="currentColor"
          d="M8 14h2v-2q0-.425.288-.712T11 11h2v2l3-3l-3-3v2h-2q-1.25 0-2.125.875T8 12zm-4 4q-.825 0-1.412-.587T2 16V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v11q0 .825-.587 1.413T20 18zm0-2h16V5H4zm0 0V5zm-3 5v-2h22v2z"
        />
      </svg>
    </button>
  );
}

function LeaveChatButton() {
  const room = useRoomContext();

  const handleLeave = () => {
    room.disconnect();
  };

  return (
    <button
      onClick={handleLeave}
      className="relative bottom-0 float-right z-50 bg-red-500 w-[3.5rem] h-[3.5rem] grid place-items-center rounded-full hover:bg-red-500/80 transition-all cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 20 20"
      >
        <rect width="20" height="20" fill="none" />
        <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
          <path d="M15.027 7.232a1 1 0 0 1 1.408.128l2.083 2.5a1 1 0 0 1-1.536 1.28l-2.083-2.5a1 1 0 0 1 .128-1.408" />
          <path d="M15.027 13.768a1 1 0 0 1-.129-1.408l2.084-2.5a1 1 0 1 1 1.536 1.28l-2.083 2.5a1 1 0 0 1-1.408.128" />
          <path d="M17.5 10.5a1 1 0 0 1-1 1H10a1 1 0 1 1 0-2h6.5a1 1 0 0 1 1 1M3 3.5a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m0 14a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1" />
          <path d="M13 2.5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m0 10a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m-9-10a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0v-14a1 1 0 0 1 1-1" />
        </g>
      </svg>
    </button>
  );
}

function Participant({ participant, bigPicture, setBigPicture }) {
  const [isHovering, setIsHovering] = useState(false);
  const tracks = useTracks();
  const participants = useParticipants();
  const { user } = useSelector((state) => state.auth);

  const metadata = JSON.parse(participant.metadata || "{}");
  const participantTracks = tracks.filter(
    (track) => track.participant.identity === participant.identity
  );

  const isSpeaking = participant.isSpeaking;

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => {
        if (
          isHovering &&
          bigPicture !== participant.identity &&
          participants.length !== 1
        ) {
          setBigPicture(participant.identity);
        } else setBigPicture(null);
      }}
      key={participant.identity}
      className={`transition-all w-full rounded-2xl h-full relative flex items-center justify-center theme-bg z-50 border-2 overflow-hidden ${
        bigPicture === participant.identity ? "col-span-full" : "col-span-1"
      } ${isSpeaking ? "border-[#8675DC]" : "border-transparent"}`}
    >
      {isSpeaking && (
        <svg
          width={700 + participants.length / 20}
          height={700 + participants.length / 20}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <circle cx="50" cy="50" r="5" fill="#4F46E5">
            <animate
              attributeName="r"
              from="5"
              to="25"
              dur="1s"
              begin="0s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="1s"
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="50" cy="50" r="5" fill="#4F46E5">
            <animate
              attributeName="r"
              from="5"
              to="25"
              dur="1s"
              begin="0.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="1s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      )}
      <button
        className={`${
          isHovering && bigPicture !== participant.identity
            ? "appearAnimation"
            : "opacity-0 pointer-events-none p-4 rounded-full opacified-bg"
        } absolute top-3 right-3 theme-hover-bg-2 cursor-pointer p-2 rounded-full`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 16 16"
        >
          <rect width="16" height="16" fill="none" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M11.293 4H9.848V3H13v3.152h-1V4.707L9.354 7.354l-.708-.708zM4 11.293l2.646-2.647l.708.708L4.707 12h1.445v1H3V9.848h1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        className={`${
          isHovering && bigPicture === participant.identity
            ? "appearAnimation"
            : "opacity-0 pointer-events-none p-4 rounded-full opacified-bg"
        } absolute top-3 right-3 theme-hover-bg-2 cursor-pointer p-2 rounded-full`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 16 16"
        >
          <rect width="16" height="16" fill="none" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="m10 5.293l2.646-2.647l.708.708L10.707 6h1.445v1H9V3.848h1zM5.293 10H3.849V9H7v3.152H6v-1.445l-2.646 2.647l-.708-.707z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Avatar image={metadata.profileImage} />
      <div className="absolute bottom-2 left-2 opacity-50">
        {participant.connectionQuality === "unknown" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-[#ccc]"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="currentColor"
              d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21"
              opacity="0"
            >
              <animate
                id="svgSpinnersWifi0"
                fill="freeze"
                attributeName="opacity"
                begin="0;svgSpinnersWifi1.end+0.2s"
                calcMode="discrete"
                dur="0.25s"
                values="0;1"
              />
              <animate
                id="svgSpinnersWifi1"
                fill="freeze"
                attributeName="opacity"
                begin="svgSpinnersWifi3.end+0.5s"
                dur="0.001s"
                values="1;0"
              />
            </path>
            <path
              fill="currentColor"
              d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"
              opacity="0"
            >
              <animate
                id="svgSpinnersWifi2"
                fill="freeze"
                attributeName="opacity"
                begin="svgSpinnersWifi0.end"
                calcMode="discrete"
                dur="0.25s"
                values="0;1"
              />
              <animate
                fill="freeze"
                attributeName="opacity"
                begin="svgSpinnersWifi3.end+0.5s"
                dur="0.001s"
                values="1;0"
              />
            </path>
            <path
              fill="currentColor"
              d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3"
              opacity="0"
            >
              <animate
                id="svgSpinnersWifi3"
                fill="freeze"
                attributeName="opacity"
                begin="svgSpinnersWifi2.end"
                calcMode="discrete"
                dur="0.25s"
                values="0;1"
              />
              <animate
                fill="freeze"
                attributeName="opacity"
                begin="svgSpinnersWifi3.end+0.5s"
                dur="0.001s"
                values="1;0"
              />
            </path>
          </svg>
        )}
        {participant.connectionQuality === "bad" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-red-400"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="currentColor"
              d="m19.75 22.6l-9.4-9.45q-1.175.275-2.187.825T6.35 15.35l-2.1-2.15q.8-.8 1.725-1.4t1.975-1.05L5.7 8.5q-1.025.525-1.913 1.163T2.1 11.1L0 8.95q.8-.8 1.663-1.437T3.5 6.3L1.4 4.2l1.4-1.4l18.4 18.4zm-1.85-7.55l-.725-.725l-.725-.725l-3.6-3.6q2.025.2 3.787 1.025T19.75 13.2zm4-3.95q-1.925-1.925-4.462-3.012T12 7q-.525 0-1.012.038T10 7.15L7.45 4.6q1.1-.3 2.238-.45T12 4q3.55 0 6.625 1.325T24 8.95zM12 21l-3.525-3.55q.7-.7 1.613-1.075T12 16t1.913.375t1.612 1.075z"
            />
          </svg>
        )}
        {participant.connectionQuality === "bad" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            className="text-green-300"
          >
            <rect width="512" height="512" fill="none" />
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M331.295 353.764c.131.181-.091-.13 0 0a46 46 0 0 0-1.039-1.365a64 64 0 0 0-3.618-4.17c-3.112-3.302-7.69-7.537-13.87-11.725C300.287 328.047 281.56 320 256 320s-44.287 8.047-56.768 16.504c-6.18 4.188-10.758 8.423-13.87 11.725a64 64 0 0 0-3.618 4.17c.264-.361-.43.544 0 0l-1.586 2.142a16 16 0 0 0 2.135 20.463l62.586 60.5c6.202 5.995 16.039 5.995 22.241 0l62.587-60.5a16 16 0 0 0 2.136-20.463z"
              clipRule="evenodd"
            />
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M421.086 269.862c-.135-.218-.596-.966-.812-1.3a72 72 0 0 0-1.81-2.639c-1.552-2.163-3.813-5.096-6.861-8.536c-6.099-6.88-15.362-15.802-28.417-24.637C356.915 214.969 315.967 198 256 198s-100.915 16.969-127.186 34.75c-13.055 8.835-22.318 17.757-28.417 24.637c-3.049 3.44-5.31 6.373-6.861 8.536a71 71 0 0 0-1.81 2.639q-.324.502-.527.829l-.285.471a16 16 0 0 0 2.678 19.664l35.31 34a16 16 0 0 0 23.007-.84l.195-.209c.207-.219.565-.591 1.074-1.096a93 93 0 0 1 4.831-4.436c4.402-3.785 11.093-8.947 19.955-14.141C195.658 292.436 221.893 282 256 282s60.342 10.436 78.036 20.804c8.862 5.194 15.553 10.356 19.955 14.141a93 93 0 0 1 4.831 4.436a49 49 0 0 1 1.269 1.305l-.005-.006l-.013-.015m0 0l.026.029a16 16 0 0 0 22.999.832l35.31-34a16 16 0 0 0 2.678-19.664"
              clipRule="evenodd"
            />
            <path
              fill="currentColor"
              d="M507.974 181.264c.343.459 1.181 1.629 1.181 1.629a16 16 0 0 1-2.029 20.606l-36.69 35.5a16 16 0 0 1-23.345-1.17l-.003-.003l-.085-.099q-.138-.16-.482-.548a108 108 0 0 0-2.197-2.379c-2.009-2.116-5.095-5.229-9.229-9.01c-8.275-7.569-20.69-17.764-36.997-27.981C365.499 177.384 317.58 157 256 157s-109.499 20.384-142.098 40.809c-16.307 10.217-28.722 20.412-36.997 27.981c-4.133 3.781-7.22 6.894-9.229 9.01a109 109 0 0 0-2.197 2.379q-.345.388-.482.548l-.047.054l-.03.034l-.004.006l-.004.005l-.004.004a16 16 0 0 1-23.344 1.169l-36.69-35.5a16 16 0 0 1-2.03-20.606l.011-.016l.013-.017l.03-.043l.079-.113l.24-.337q.295-.413.809-1.103c.686-.92 1.667-2.199 2.949-3.786c2.563-3.174 6.335-7.585 11.367-12.818c10.057-10.46 25.185-24.241 45.783-37.973C105.437 99.146 168.48 72 256 72s150.563 27.146 191.875 54.687c20.598 13.732 35.726 27.513 45.783 37.973c5.032 5.233 8.804 9.644 11.367 12.818a125 125 0 0 1 2.949 3.786"
            />
          </svg>
        )}
        {participant.connectionQuality === "excellent" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            className="text-green-500"
          >
            <rect width="512" height="512" fill="none" />
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M331.295 353.764c.131.181-.091-.13 0 0a46 46 0 0 0-1.039-1.365a64 64 0 0 0-3.618-4.17c-3.112-3.302-7.69-7.537-13.87-11.725C300.287 328.047 281.56 320 256 320s-44.287 8.047-56.768 16.504c-6.18 4.188-10.758 8.423-13.87 11.725a64 64 0 0 0-3.618 4.17c.264-.361-.43.544 0 0l-1.586 2.142a16 16 0 0 0 2.135 20.463l62.586 60.5c6.202 5.995 16.039 5.995 22.241 0l62.587-60.5a16 16 0 0 0 2.136-20.463z"
              clipRule="evenodd"
            />
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M421.086 269.862c-.135-.218-.596-.966-.812-1.3a72 72 0 0 0-1.81-2.639c-1.552-2.163-3.813-5.096-6.861-8.536c-6.099-6.88-15.362-15.802-28.417-24.637C356.915 214.969 315.967 198 256 198s-100.915 16.969-127.186 34.75c-13.055 8.835-22.318 17.757-28.417 24.637c-3.049 3.44-5.31 6.373-6.861 8.536a71 71 0 0 0-1.81 2.639q-.324.502-.527.829l-.285.471a16 16 0 0 0 2.678 19.664l35.31 34a16 16 0 0 0 23.007-.84l.195-.209c.207-.219.565-.591 1.074-1.096a93 93 0 0 1 4.831-4.436c4.402-3.785 11.093-8.947 19.955-14.141C195.658 292.436 221.893 282 256 282s60.342 10.436 78.036 20.804c8.862 5.194 15.553 10.356 19.955 14.141a93 93 0 0 1 4.831 4.436a49 49 0 0 1 1.269 1.305l-.005-.006l-.013-.015m0 0l.026.029a16 16 0 0 0 22.999.832l35.31-34a16 16 0 0 0 2.678-19.664"
              clipRule="evenodd"
            />
            <path
              fill="currentColor"
              d="M507.974 181.264c.343.459 1.181 1.629 1.181 1.629a16 16 0 0 1-2.029 20.606l-36.69 35.5a16 16 0 0 1-23.345-1.17l-.003-.003l-.085-.099q-.138-.16-.482-.548a108 108 0 0 0-2.197-2.379c-2.009-2.116-5.095-5.229-9.229-9.01c-8.275-7.569-20.69-17.764-36.997-27.981C365.499 177.384 317.58 157 256 157s-109.499 20.384-142.098 40.809c-16.307 10.217-28.722 20.412-36.997 27.981c-4.133 3.781-7.22 6.894-9.229 9.01a109 109 0 0 0-2.197 2.379q-.345.388-.482.548l-.047.054l-.03.034l-.004.006l-.004.005l-.004.004a16 16 0 0 1-23.344 1.169l-36.69-35.5a16 16 0 0 1-2.03-20.606l.011-.016l.013-.017l.03-.043l.079-.113l.24-.337q.295-.413.809-1.103c.686-.92 1.667-2.199 2.949-3.786c2.563-3.174 6.335-7.585 11.367-12.818c10.057-10.46 25.185-24.241 45.783-37.973C105.437 99.146 168.48 72 256 72s150.563 27.146 191.875 54.687c20.598 13.732 35.726 27.513 45.783 37.973c5.032 5.233 8.804 9.644 11.367 12.818a125 125 0 0 1 2.949 3.786"
            />
          </svg>
        )}
      </div>
      <p className="text-lg absolute bottom-0">
        {metadata.displayName}
        {participant.identity === user._id && " (You)"}
      </p>
      {isSpeaking && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className="absolute z-30 bottom-2 right-2 text-[#8675DC] bg-[#8675DC20] rounded-full animate-pulse"
        >
          <rect width="24" height="24" fill="none" />
          <path
            fill="currentColor"
            d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5z"
          />
        </svg>
      )}
      {participantTracks.map((track) => (
        <div key={track.sid} className="absolute w-full z-50">
          <ParticipantTile trackRef={track} />
        </div>
      ))}
    </div>
  );
}

export default function CustomVideoConference() {
  const participants = useParticipants();
  const chat = useChat();
  const [bigPicture, setBigPicture] = useState(null);
  const [prevParticipants, setPrevParticipants] = useState([]);
  const joinSound = useRef(null);
  const leaveSound = useRef(null);

  useEffect(() => {
    joinSound.current = new Audio("/sounds/discord-leave-noise.mp3");
    leaveSound.current = new Audio("/sounds/yt1s_nYWSz5R.mp3");
  }, []);

  useEffect(() => {
    const currentIds = participants.map((p) => p.identity);
    const prevIds = prevParticipants.map((p) => p.identity);

    const newParticipants = currentIds.filter((id) => !prevIds.includes(id));
    if (newParticipants.length > 0) {
      leaveSound.current.play().catch((error) => {
        console.error("Failed to play join sound:", error);
      });
    }

    const leftParticipants = prevIds.filter((id) => !currentIds.includes(id));
    if (leftParticipants.length > 0) {
      joinSound.current.play().catch((error) => {
        console.error("Failed to play leave sound:", error);
      });
    }

    setPrevParticipants(participants);
  }, [participants]);

  const reorderedParticipants = bigPicture
    ? [
        participants.find((p) => p.identity === bigPicture),
        ...participants.filter((p) => p.identity !== bigPicture),
      ]
    : participants;

  const maxSmallParticipants = 4;
  const bigParticipant = bigPicture ? reorderedParticipants[0] : null;
  const smallParticipants = bigPicture
    ? reorderedParticipants.slice(1, maxSmallParticipants + 1)
    : reorderedParticipants;

  const remainingParticipants =
    participants.length -
    (bigPicture ? maxSmallParticipants + 1 : smallParticipants.length);

  return (
    <div className="sidepanel h-full flex flex-col justify-between">
      <div className="h-full w-full flex flex-col items-center gap-2 my-2">
        {bigPicture && (
          <div className="w-full h-2/3">
            <Participant
              bigPicture={bigPicture}
              setBigPicture={setBigPicture}
              participant={bigParticipant}
            />
          </div>
        )}

        <div
          className={`grid gap-2 w-full ${
            bigPicture
              ? "grid-cols-4 h-1/3"
              : participants.length > 5
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full"
              : "grid-cols-[repeat(auto-fit,minmax(0,1fr))] h-full"
          }`}
        >
          {smallParticipants.map((participant) => (
            <div
              key={participant.identity}
              className="flex justify-center h-full"
            >
              <Participant
                bigPicture={bigPicture}
                setBigPicture={setBigPicture}
                participant={participant}
              />
            </div>
          ))}
        </div>

        {remainingParticipants > 0 && (
          <div className="col-span-full flex items-center justify-center p-4 text-gray-400">
            and {remainingParticipants} more
          </div>
        )}
      </div>

      <div className="relative mb-4 self-center flex gap-4">
        <TrackToggle source={Track.Source.Microphone} />
        <TrackToggle source={Track.Source.Camera} />
        <ScreenShareButton />
        <LeaveChatButton />
      </div>

      {chat.isOpen && (
        <div className="chat-window">{/* Render chat messages here */}</div>
      )}
    </div>
  );
}
