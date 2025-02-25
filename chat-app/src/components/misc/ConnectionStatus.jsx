import { useRoom, ConnectionState } from "@livekit/components-react";
import { useEffect } from "react";

export default function ConnectionStatus() {
  const room = useRoom();
  const connectionState = room.state;

  useEffect(() => {
    if (connectionState === ConnectionState.Disconnected) {
      console.log("User disconnected");
    } else if (connectionState === ConnectionState.Connected) {
      console.log("User reconnected");
    }
  }, [connectionState]);

  return <div className="connection-status">Status: {connectionState}</div>;
}
