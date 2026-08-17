require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Category = require("./models/Category");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const Message = require("./models/Message");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    // Delete old data in the correct order
    await Message.deleteMany({});
    await Registration.deleteMany({});
    await Event.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log("Old data deleted");

    // Create Admin
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    const admin = await User.create({
      name: "EventPulse Admin",
      email: "admin@eventpulse.com",
      password: hashedPassword,
      role: "admin",
    });

    // Create Categories
    const categories = await Category.insertMany([
      {
        name: "Technology",
        description: "Technology and programming events",
      },
      {
        name: "Music",
        description: "Music and live entertainment events",
      },
      {
        name: "Sports",
        description: "Sports and fitness events",
      },
      {
        name: "Education",
        description: "Educational and learning events",
      },
    ]);

    // Create Events
    const events = await Event.insertMany([
      {
        title: "Tech Conference 2026",
        description: "A conference about modern technology and innovation",
        category: categories[0]._id,
        date: new Date("2026-09-15"),
        city: "Cairo",
        venue: "Cairo International Convention Centre",
        capacity: 200,
        organizer: admin._id,
      },
      {
        title: "Live Music Festival",
        description: "A live music event featuring local artists",
        category: categories[1]._id,
        date: new Date("2026-09-25"),
        city: "Giza",
        venue: "Pyramids Arena",
        capacity: 500,
        organizer: admin._id,
      },
      {
        title: "Football Championship",
        description: "A competitive football championship",
        category: categories[2]._id,
        date: new Date("2026-10-10"),
        city: "Alexandria",
        venue: "Alexandria Stadium",
        capacity: 1000,
        organizer: admin._id,
      },
      {
        title: "Future of Education",
        description: "A discussion about the future of education",
        category: categories[3]._id,
        date: new Date("2026-10-20"),
        city: "Cairo",
        venue: "Bibliotheca Alexandria Hall",
        capacity: 150,
        organizer: admin._id,
      },
    ]);

    console.log("Database seeded successfully");
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${events.length} events`);
    console.log("Created 1 admin");

    console.log("Admin email: admin@eventpulse.com");
    console.log("Admin password: Admin123!");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedDatabase();
