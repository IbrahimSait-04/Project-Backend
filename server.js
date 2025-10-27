import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import connectdb from "./src/config/db.js";

// 🧩 Import Routers
import adminRouter from "./src/router/adminRouter.js";
import staffRouter from "./src/router/staffRouter.js";
import customerRouter from "./src/router/customerRouter.js";
import menuRouter from "./src/router/menuRouter.js";
import orderRouter from "./src/router/orderRouter.js";
import paymentRouter from "./src/router/paymentRouter.js";
import reservationRouter from "./src/router/reservationRouter.js";

// 🌿 Load environment variables
dotenv.config();

// 🗄️ Connect Database
connectdb();

// ⚙️ Initialize Express
const app = express();

// 🧠 Middleware
app.use(express.json());
app.use(cors());

// 📁 Ensure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🌐 Serve static uploads
app.use("/uploads", express.static(uploadDir));

// 🚏 API Routes
app.use("/api/admin", adminRouter);
app.use("/api/staff", staffRouter);
app.use("/api/customer", customerRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/reservations", reservationRouter);

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

export default app;
