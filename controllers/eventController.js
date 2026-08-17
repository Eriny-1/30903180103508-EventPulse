const Event = require("../models/Event");
const Category = require("../models/Category");
const User = require("../models/User");

const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// ==================== GET ALL EVENTS ====================

const getEvents = asyncHandler(async (req, res, next) => {
  const {
    category,
    city,
    startDate,
    endDate,
    page,
    limit,
    sortBy,
    order,
    search,
  } = req.query;

  // ====================
  // Filtering
  // ====================

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (city) {
    filter.city = city;
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }

    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  // ====================
  // Search
  // ====================

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // ====================
  // Pagination
  // ====================

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  // ====================
  // Sorting
  // ====================

  const allowedSortFields = ["date", "registrations"];

  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";

  const sortDirection = order === "desc" ? -1 : 1;

  const sort = {
    [sortField]: sortDirection,
  };

  // ====================
  // Database Queries
  // ====================

  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate("category")
      .populate("organizer", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum),

    Event.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  // ====================
  // Response
  // ====================

  res.status(200).json({
    status: "success",
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data,
  });
});

// ==================== GET EVENT BY ID ====================

const getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate("category")
    .populate("organizer", "name email");

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: event,
  });
});

// ==================== CREATE EVENT ====================

const createEvent = asyncHandler(async (req, res, next) => {
  const { title, description, category, date, city, venue, capacity } =
    req.body;

  if (
    !title ||
    !description ||
    !category ||
    !date ||
    !city ||
    !venue ||
    !capacity
  ) {
    return next(
      new AppError(
        "Title, description, category, date, city, venue and capacity are required",
        400,
      ),
    );
  }

  const event = await Event.create({
    title,
    description,
    category,
    date,
    city,
    venue,
    capacity,
    organizer: req.user.userId,
  });

  const populatedEvent = await Event.findById(event._id)
    .populate("category")
    .populate("organizer", "name email");

  res.status(201).json({
    status: "success",
    data: populatedEvent,
  });
});

// ==================== UPDATE EVENT ====================

const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("category")
    .populate("organizer", "name email");

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: event,
  });
});

// ==================== DELETE EVENT ====================

const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Event deleted successfully",
  });
});

// ==================== EXPORT ====================

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
