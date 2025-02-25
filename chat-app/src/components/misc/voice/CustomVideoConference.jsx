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

  console.log(participant.identity, bigPicture);

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
      <p className="absolute">{participant.connectionQuality}</p>
      <p className="text-lg absolute bottom-0">
        {metadata.displayName || "Unknown User"}
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
