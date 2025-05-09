const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cart");

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Compression middleware
app.use(compression());

// CORS middleware
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Cache control middleware
app.use((req, res, next) => {
  // Cache static assets for 1 day
  if (req.url.match(/^\/(css|js|img|font)/i)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Base route
app.get("/", (req, res) => {
  res.send("Hello from the Product API!");
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});
