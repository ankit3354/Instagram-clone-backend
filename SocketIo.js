const socketIo = (io) => {
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    const user = socket.handshake.auth.user;

    console.log("User connected ", user?.userName);
    //! Start join room
    socket.on("Join room", (groupId) => {
      socket.join(groupId);

      connectedUsers.set(socket.id, { user, room: groupId });

      const userInRooms = Array.from(connectedUsers.values())
        .filter((u) => u.room === groupId)
        .map((u) => u.user);

      io.in(groupId).emit("user in rooms", userInRooms);

      socket.to(groupId).emit("notification", {
        type: "USER_JOINED",
        message: `${user?.userName} has joined`,
        user: user,
      });
    });
    //! End join room

    //! Leave join room
    socket.on("leave room", (groupId) => {
      console.log(`${user?.username} leavning room`, groupId);

      socket.leave(groupId);

      if (connectedUsers.has(socket.id)) {
        connectedUsers.delete(socket.id);

        socket.to(groupId).emit("user left", user?._id);
      }
    });
    //! End Leave room

    //! New Message join room
    socket.on("new message", (message) => {
      socket.to(message.groupId).emit("message received", message);
    });
    //! New Message join room

    //! Disconnect join room
    socket.io("disconnect", (groupId) => {
      console.log(`${user?.userName} disconnected`);

      if (connectedUsers.has(socket.id)) {
        const userData = connectedUsers.get(socket.id);

        socket.to(userData.room).emit("user left", user?._id);

        connectedUsers.delete(socket.id);
      }
    });
    //! Disconnect join room

    //! Type Interactive
    socket.io("typing", ({ groupId, userName }) => {
      socket.to(groupId).emit("user typing", { userName });
    });

    socket.io("stop typing", ({ groupId }) => {
      socket.to(groupId).emit("user stop typing", { userName: user?.userName });
    });
    //! Type Interactive
  });
};

module.exports = socketIo;
