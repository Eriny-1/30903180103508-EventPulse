const Registration = require("../models/Registration");
const Event = require("../models/Event");

// =========================
// Register for Event
// =========================

const registerForEvent = async (req, res) => {
  const userId = req.user.id || req.user.userId;
  const eventId = req.body.eventId;

  // Check event
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  // Check duplicate registration
  const existing = await Registration.findOne({
    event: eventId,
    attendee: userId,
  });

  if (existing) {
    return res.status(400).json({
      status: "fail",
      message: "You are already registered for this event",
    });
  }

  // Check capacity
  const currentCount = await Registration.countDocuments({
    event: eventId,
  });

  if (currentCount >= event.capacity) {
    return res.status(400).json({
      status: "fail",
      message: "This event is full",
    });
  }

  // Create registration
  const registration = await Registration.create({
    event: eventId,
    attendee: userId,
  });

  res.status(201).json({
    status: "success",
    data: registration,
  });
};

// =========================
// My Registrations
// =========================

const getMyRegistrations = async (req, res) => {
  const userId = req.user.id || req.user.userId;

  const registrations = await Registration.find({
    attendee: userId,
  }).populate("event");

  res.status(200).json({
    status: "success",
    data: registrations,
  });
};

// =========================
// Cancel Registration
// =========================

const cancelRegistration = async (req, res) => {
  const userId = req.user.id || req.user.userId;
  const registrationId = req.params.id;

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    return res.status(404).json({
      status: "fail",
      message: "Registration not found",
    });
  }

  // Ownership check
  if (registration.attendee.toString() !== userId.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "You can only cancel your own registration",
    });
  }

  await registration.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Registration cancelled successfully",
  });
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};
