import express from "express";
import { adminLogin, createStaff, deleteStaff, getAllStaff, updateAdminProfile, updateStaff, getAdminProfile, adminCreate,  } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createMenuItem } from "../controllers/menuController.js";
import { getAllCustomers } from "../controllers/customerController.js";

const adminRouter = express.Router();

// Login route (no middleware)
adminRouter.post("/login", adminLogin);
adminRouter.post('/', adminCreate);

// Admin profile routes
adminRouter.get("/profile", protect("admin"), getAdminProfile);
adminRouter.put("/profile", protect("admin"), updateAdminProfile);

// Staff CRUD routes (only admin)
adminRouter.get("/staff", protect("admin"), getAllStaff);
adminRouter.post("/staff", protect("admin"), createStaff);
adminRouter.put("/staff/:id", protect("admin"), updateStaff);
adminRouter.delete("/staff/:id", protect("admin"), deleteStaff);
adminRouter.get("/customer", protect("admin"), getAllCustomers);



//menu
adminRouter.post("/menucreate" , createMenuItem);
export default adminRouter;
