const Event = require('./models/Event');
const eventRoutes = require('./routes/eventRoutes');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Loading environment variables
dotenv.config();

// MongoDB Connection
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use('/chartjs', express.static('./node_modules/chart.js/dist/'));

// Route
app.use('/api/events', eventRoutes);


// Testing Route
app.get("/", (req, res) => {
  res.send("Event Logging System API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
