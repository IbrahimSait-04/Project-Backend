import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import connectdb from "./src/config/db.js";

import adminRouter from "./src/router/adminRouter.js";
import staffRouter from "./src/router/staffRouter.js";
import customerRouter from "./src/router/customerRouter.js";
import menuRouter from "./src/router/menuRouter.js";
import orderRouter from "./src/router/orderRouter.js";
import paymentRouter from "./src/router/paymentRouter.js";
import reservationRouter from "./src/router/reservationRouter.js";

dotenv.config();
connectdb();

const app = express();

const allowedOrigins = [
  "https://project-frontend-nine-nu.vercel.app", //  Vercel frontend
  "http://localhost:5173",                       // dev (Vite)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.options("*", cors());

app.use(express.json());

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));

app.use("/api/admin", adminRouter);
app.use("/api/staff", staffRouter);
app.use("/api/customer", customerRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/reservations", reservationRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

export default app;
