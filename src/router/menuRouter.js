import express from "express";
import multer from "multer";
import path from "path";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
  getMenuItemById,
} from "../controllers/menuController.js";

const menuRouter = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
menuRouter.post("/create", upload.single("image"), createMenuItem);
menuRouter.put("/:id", upload.single("image"), updateMenuItem);
menuRouter.get("/", getMenuItems);
menuRouter.get("/:id", getMenuItemById);
menuRouter.delete("/:id", deleteMenuItem);

export default menuRouter;
