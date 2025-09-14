export function safeEmit(socket, event, payload) {
    if (socket && socket.connected) {
      socket.emit(event, payload);
    }
  }