require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// =========================
// Middleware
// =========================

app.use(morgan("dev"));
app.use(express.json());

// =========================
// Home route
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "EventPulse API is running",
  });
});

// =========================
// Swagger Documentation
// =========================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =========================
// Health Check
// =========================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// =========================
// Routes
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/registrations", registrationRoutes);

app.use("/api/announcements", announcementRoutes);

// =========================
// 404 Handler
// =========================

app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// =========================
// Error Handler
// =========================

app.use(errorHandler);

// =========================
// HTTP Server
// =========================

const httpServer = http.createServer(app);

// =========================
// Socket.io
// =========================

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Make io available to controllers
app.set("io", io);

// =========================
// Socket Connection
// =========================

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join event room
  socket.on("join-event", (eventId) => {
    socket.join(eventId);

    console.log(`Socket ${socket.id} joined event ${eventId}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// =========================
// Start Server
// =========================

async function start() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);

    process.exit(1);
  }
}

start();

module.exports = app;
