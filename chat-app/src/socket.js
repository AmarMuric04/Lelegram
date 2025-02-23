import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_PORT;

export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 1,
  reconnection: false,
});

export const connectSocket = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  if (!socket.connected) {
    socket.io.opts.query = { userId };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
