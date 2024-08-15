import client from "../client";
import io from "socket.io-client";

const SOCKET_URL = client;

let socket;

export const connectSocket = (userId) => {
  socket = io(SOCKET_URL);

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    socket.emit("join", userId);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });
};

export const sendMessage = (message) => {
  socket.emit("newMessage", message);
};

export const receiveMessage = (callback) => {
  socket.on("newMessage", (message) => {
    callback(message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};