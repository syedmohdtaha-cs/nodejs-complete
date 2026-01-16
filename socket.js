let io;

io = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3002",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      const uniqueKey = socket.handshake.query.uniqueKey || "unknown";

      console.log(
        `User connected with unique key: ${uniqueKey}, Socket ID: ${socket.id}`
      );

      socket.join(uniqueKey);

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${uniqueKey}, Socket ID: ${socket.id}`);
      });
    });
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },
  emitToRoom: (roomName, event, data) => {
    if (io) {
      io.to(roomName).emit(event, data);
    }
  },
};

module.exports = io;
