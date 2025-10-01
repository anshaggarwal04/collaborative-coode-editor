import { handleJoinRoom, handleLeaveRoom } from "./roomHandlers.js";

export function initRoomSocket(io, socket) {
  socket.on("joinRoom", (data) => handleJoinRoom(io, socket, data));
  socket.on("leaveRoom", (data) => handleLeaveRoom(io, socket, data));

  // Simple chat broadcast to all rooms this socket is in
  socket.on("chatMessage", (msg) => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    rooms.forEach((roomId) => {
      io.to(roomId).emit("chatMessage", msg);
    });
  });

  // Auto-cleanup on disconnect: leave all joined rooms
  socket.on("disconnect", () => {
    const currentRooms = [...socket.rooms].filter((r) => r !== socket.id);
    currentRooms.forEach((roomId) => {
      handleLeaveRoom(io, socket, { roomId });
    });
  });
}