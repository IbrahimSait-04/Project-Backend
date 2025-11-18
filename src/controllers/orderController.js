import { Order } from "../models/order.js";
import { Menu } from "../models/menu.js";

/* CREATE ORDER (Customer only) */
export const createOrder = async (req, res) => {
  try {
    const { items, type, method } = req.body;
    if (!items?.length || !type || !method) {
      return res.status(400).json({ message: "items, type, method are required" });
    }
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    // Price from DB to avoid client tampering
    const menuIds = items.map(i => i.product);
    const menus = await Menu.find({ _id: { $in: menuIds } }).select("price");
    const priceMap = new Map(menus.map(m => [String(m._id), m.price]));

    let totalAmount = 0;
    for (const i of items) {
      const price = priceMap.get(String(i.product));
      if (price == null) {
        return res.status(400).json({ message: "Invalid menu item in order" });
      }
      totalAmount += price * (i.quantity || 1);
    }

    const newOrder = await Order.create({
      user: req.user._id,
      items: items.map(i => ({ product: i.product, quantity: i.quantity || 1 })),
      totalAmount,
      type,
      method,
    });

    const populated = await Order.findById(newOrder._id)
      .populate("user", "name email")
      .populate({ path: "items.product", model: "Menu", select: "name price image" });

    res.status(201).json({ message: "Order created successfully", order: populated });
  } catch (error) {
    console.error("createOrder:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

/* GET MY ORDERS (Customer only) */
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ user: req.user._id })
      .populate({ path: "items.product", model: "Menu", select: "name price image" })
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("getMyOrders:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/* GET ALL ORDERS (Admin/Staff) */
export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate({ path: "items.product", model: "Menu", select: "name price image" })
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("getAllOrders:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/* GET ORDER BY ID (Admin/Staff) — for View Details */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate({ path: "items.product", model: "Menu", select: "name price image" });

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (error) {
    console.error("getOrderById:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/* UPDATE STATUS (Admin/Staff) */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = [
      "pending","accepted","confirmed","preparing","handed over to customer","completed","cancelled",
    ];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "name email")
      .populate({ path: "items.product", model: "Menu", select: "name price image" });

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    console.error("updateOrderStatus:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
