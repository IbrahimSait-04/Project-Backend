import { Order } from "../models/order.js";

/* CREATE ORDER (Customer only) */
export const createOrder = async (req, res) => {
  try {
    // ✅ ensure logged-in customer
    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied: Customers only" });
    }

    const { items, totalAmount, type, method } = req.body;

    if (!items?.length || !totalAmount || !type || !method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new Order({
      customer: req.user._id, // ✅ correct field
      items,
      totalAmount,
      type,
      method,
      status: "pending",
    });

    await order.save();

    res.status(201).json({
      message: "✅ Order created successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* GET MY ORDERS (Customer only) */
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ customer: req.user._id })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "✅ Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* GET ALL ORDERS (Admin/Staff) */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* UPDATE ORDER STATUS (Admin/Staff) */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
