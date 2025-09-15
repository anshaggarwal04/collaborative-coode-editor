///Users/anshaggarwal/Desktop/project_2/backend/src/sockets/utils.js

export function safeEmit(socket, event, payload) {
    if (socket && socket.connected) {
      socket.emit(event, payload);
    }
  }