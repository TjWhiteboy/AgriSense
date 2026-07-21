const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('morgan');

const chatRoutes = require('./routes/chatRoutes');
const cropRoutes = require('./routes/cropRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const marketRoutes = require('./routes/marketRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Middleware
app.use(helmet());
app.use(cors());
app.use(logger('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use('/api', chatRoutes);
app.use('/api', cropRoutes);
app.use('/api', profileRoutes);
app.use('/api', weatherRoutes);
app.use('/api', marketRoutes);
app.use('/api', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
