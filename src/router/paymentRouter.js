import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createPayment, verifyPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/", protect("customer"), createPayment);
paymentRouter.post("/verify", protect("customer"), verifyPayment);

export default paymentRouter;
