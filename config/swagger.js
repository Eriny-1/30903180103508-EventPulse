const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "EventPulse API",
      version: "1.0.0",
      description: "EventPulse Backend API Documentation",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Events",
        description: "Event management endpoints",
      },
      {
        name: "Registrations",
        description: "Event registration endpoints",
      },
      {
        name: "Announcements",
        description: "Event announcement endpoints",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["attendee", "admin"],
              example: "attendee",
            },
          },
        },

        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            name: {
              type: "string",
              example: "Technology",
            },
            description: {
              type: "string",
              example: "Technology and programming events",
            },
          },
        },

        Event: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            title: {
              type: "string",
              example: "Frontend Workshop",
            },
            description: {
              type: "string",
              example: "Learn modern frontend development",
            },
            category: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2026-09-01T10:00:00.000Z",
            },
            city: {
              type: "string",
              example: "Cairo",
            },
            venue: {
              type: "string",
              example: "Cairo University",
            },
            capacity: {
              type: "integer",
              example: 50,
            },
            registrations: {
              type: "integer",
              example: 0,
            },
            organizer: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
          },
        },

        Registration: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            event: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            attendee: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
          },
        },

        Message: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            event: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            sender: {
              type: "string",
              example: "64f0a1b2c3d4e5f678901234",
            },
            text: {
              type: "string",
              example: "The event starts at 10 AM.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
