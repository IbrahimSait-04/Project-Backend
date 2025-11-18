import express from "express";
import {
  createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const orderrouter = express.Router();

// Customer
orderrouter.post("/", protect("customer"), createOrder);
orderrouter.get("/my-orders", protect("customer"), getMyOrders);

// Admin/Staff
orderrouter.get("/", protect(["staff","admin"]), getAllOrders);
orderrouter.get("/:id", protect(["staff","admin"]), getOrderById);        // <<— for View Details
orderrouter.put("/:id/status", protect(["staff","admin"]), updateOrderStatus);

export default orderrouter;
