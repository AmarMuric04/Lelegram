import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_PORT;

export let socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  const userId = localStorage.getItem("userId");

  if (!userId) return;

  socket = io(SOCKET_SERVER_URL, {
    query: { userId },
  });

  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
