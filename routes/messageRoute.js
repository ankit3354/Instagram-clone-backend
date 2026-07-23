const express = require("express");
const Message = require("../model/ChatsModel");
const { protect } = require("../middleware/AuthMiddleware");

const messageRoute = express.Router();

// send a message
messageRoute.post("/", protect, async (req, res) => {
  try {
    const { content, groupId } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      content,
      group: groupId,
    });

    const populateMessage = await Message.findById(message._id).populate(
      "sender",
      "userName email",
    );
    res.json(populateMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get messages
messageRoute.get("/:groupId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = messageRoute;
