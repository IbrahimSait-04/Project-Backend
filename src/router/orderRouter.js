import express from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const orderrouter = express.Router();

// 🟢 Customer routes
orderrouter.post("/", protect("customer"), createOrder);
orderrouter.get("/my-orders", protect("customer"), getMyOrders);

// 🟡 Staff/Admin routes
orderrouter.get("/", protect(["staff", "admin"]), getAllOrders);
orderrouter.put("/:id/status", protect(["staff", "admin"]), updateOrderStatus);

export default orderrouter;
