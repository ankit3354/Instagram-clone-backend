const express = require("express");
const connectDB = require("./config/db.config");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const { createServer } = require("http");
const socketIo = require("./SocketIo");
const userRouter = require("./routes/userRoutes");
const groupRoute = require("./routes/groupRoutes");
const messageRoute = require("./routes/messageRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Socket io
const server = createServer(app);

const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173"],
    method: ["GET", "POST"],
    credentials: true,
  },
});

// middlewares
app.use(cors());
app.use(express.json());

// connect to DB
connectDB();

// Initialize socket
socketIo(io);

app.use("/api/user", userRouter);
app.use("/api/groups", groupRoute);
app.use("/api/messages", messageRoute);

// Server Health
app.get("/", (req, res) => {
  return res.json({ msg: "Hello world" });
});

// Running server
app.listen(PORT, () => {
  console.log(`Server is runnig on http://localhost:${PORT}`);
});
