const Message = require("../models/Message");

// =========================
// Create Announcement
// =========================

const createAnnouncement = async (req, res) => {
  const { eventId, text } = req.body;

  const message = await Message.create({
    event: eventId,
    sender: req.user.userId,
    text: text,
  });

  // Get Socket.io instance
  const io = req.app.get("io");

  // Broadcast announcement to event room
  io.to(eventId).emit("announcement", message);

  res.status(201).json({
    status: "success",
    data: message,
  });
};

// =========================
// Get Announcement History
// =========================

const getAnnouncements = async (req, res) => {
  const { eventId } = req.params;

  const messages = await Message.find({
    event: eventId,
  })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: "success",
    data: messages,
  });
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
};
