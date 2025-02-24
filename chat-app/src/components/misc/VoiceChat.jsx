"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

const VoiceChat = ({ chatId, user, onUserLeft }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user) return;
    const id = `${user.firstName}, ${user.lastName[0]} (${user._id})`;

    (async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_PORT
          }/api/livekit?chatId=${chatId}&id=${id}`
        );

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.log("Error fetching LiveKit token:", error);
      }
    })();
  }, [chatId, user]);

  if (!token) {
    return;
  }

  const handleDisconnected = () => {
    if (onUserLeft) onUserLeft();
  };

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={import.meta.env.VITE_LIVEKIT_SERVER}
      token={token}
      connect={true}
      onDisconnected={handleDisconnected}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default VoiceChat;

VoiceChat.propTypes = {
  chatId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onUserLeft: PropTypes.func,
};
