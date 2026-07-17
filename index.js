const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// Socket io
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected!");
  socket.emit("ServerMessage", "Hello from server!");

  socket.on("message", (message) => {
    console.log("Client msg", message);
  });
});

// Server Health
app.get("/", (req, res) => {
  return res.json({ msg: "Hello world" });
});

// Running server
app.listen(PORT, () => {
  console.log(`Server is runnig on http://localhost:${PORT}`);
});
