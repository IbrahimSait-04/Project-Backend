import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/order.js";
import dotenv from "dotenv";

dotenv.config();

// 🟢 Initialize Razorpay with keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 💰 Create Razorpay Order
export const createPayment = async (req, res) => {
  try {
    const { totalAmount, method } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(totalAmount * 100), // amount in paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      orderId: order.id,
    });
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

// 🧾 Verify Payment + Create Order in DB
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      items,
      totalAmount,
      type,
      method,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment details" });
    }

    // 🔐 Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Signature verification failed");
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ Save Order in MongoDB
    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount,
      type,
      method,
      status: "confirmed",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ message: "Server error during payment verification", error: error.message });
  }
};
