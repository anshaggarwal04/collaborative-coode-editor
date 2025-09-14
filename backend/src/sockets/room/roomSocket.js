import { handleJoinRoom, handleLeaveRoom } from "./roomHandlers.js";

export function initRoomSocket(io, socket) {
  socket.on("joinRoom", (data) => handleJoinRoom(io, socket, data));
  socket.on("leaveRoom", (data) => handleLeaveRoom(io, socket, data));

  // 🔹 Auto-cleanup on disconnect
  socket.on("disconnect", () => {
    const currentRooms = [...socket.rooms].filter((r) => r !== socket.id); 
    currentRooms.forEach((roomName) => {
      handleLeaveRoom(io, socket, { roomName });
    });
  });
}