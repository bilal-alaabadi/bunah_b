const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = 5000;

// ميدل وير أساسية
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// CORS: فقط هذي الروابط
const allowedOrigins = [
  "https://www.bunah3.com",
  "https://bunah3.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// رفع الصور
const uploadImage = require("./src/utils/uploadImage");

// جميع الراوتات
const authRoutes = require("./src/users/user.route");
const productRoutes = require("./src/products/products.route");
const reviewRoutes = require("./src/reviews/reviews.router");
const orderRoutes = require("./src/orders/orders.route");
const statsRoutes = require("./src/stats/stats.rout");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

// اتصال قاعدة البيانات
main()
  .then(() => console.log("MongoDB is successfully connected."))
  .catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.get("/", (req, res) => res.send("يعمل الان"));
}

// رفع صورة واحدة
app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

// رفع عدة صور
app.post("/uploadImages", async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).send("Invalid request: images array is required.");
    }
    const urls = await Promise.all(images.map((img) => uploadImage(img)));
    res.send(urls);
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).send("Internal Server Error");
  }
});

// هاندلر أخطاء (خاصة CORS)
app.use((err, req, res, next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS blocked this origin" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});