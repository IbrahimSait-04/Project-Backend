import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "card", "online"], required: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, 
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
