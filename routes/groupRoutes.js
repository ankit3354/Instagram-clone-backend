const express = require("express");
const Group = require("../model/GroupModel");
const { protect, isAdmin } = require("../middleware/AuthMiddleware");
const groupRoute = express.Router();

// Create Group
groupRoute.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });

    const groupPopulate = await Group.findById(group._id)
      .populate("admin", "userName email")
      .populate("members", "userName email");

    return res.status(201).json(groupPopulate);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Get Group
groupRoute.get("/", async (req, res) => {
  try {
    const group = await Group.find()
      .populate("admin", "userName email")
      .populate("members", "userName email");

    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ message: "Groups Not found" });
  }
});

// Join group
groupRoute.post("/:groupId/join", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }
    if (group.members.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "Alreay a member of this group!" });
    }

    group.members.push(req.user._id);
    await group.save();
    res.status(201).json({ message: "Group joined successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Leave Group
groupRoute.post("/:groupId/leave", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found!" });
    }
    if (!group.members.includes(req.user._id)) {
      res.status(404).json({ message: "member not found!" });
    }

    group.members.pull(req.user._id);
    await group.save();

    res.status(200).json({ message: "Leave group successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = groupRoute;
