const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
require("dotenv").config();

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  userId: String,
  collegeEmail: String,
  collegeRollNumber: String,
  numbers: [Number],
  alphabets: [String],
});

const User = mongoose.model("User", userSchema);

// POST endpoint
app.post("/api/data", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid data format",
      });
    }

    // Separate numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item)).map(Number);
    const alphabets = data.filter((item) => isNaN(item));

    // Find the highest alphabet (case-insensitive)
    const highestAlphabet =
      alphabets.length > 0
        ? alphabets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })).pop()
        : null;

    const newUser = new User({ numbers, alphabets });
    await newUser.save();

    res.json({
      status: "success",
      message: "Data saved successfully",
      numbers,
      alphabets,
      highestAlphabet, // ✅ Now included in response
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});



// GET endpoint
app.get("/api/data", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
