import { Server } from "socket.io";

let ioInstance = null;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  return ioInstance;
};

export const getSocket = () => {
  if (!ioInstance) {
    throw new Error("Socket.io is not initialized.");
  }
  return ioInstance;
};
