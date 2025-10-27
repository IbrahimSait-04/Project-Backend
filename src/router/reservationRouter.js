import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationsByCustomer,
  updateReservationStatus,
  deleteReservation,
} from "../controllers/reservationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const reservationRouter = express.Router();

// Customer
reservationRouter.post("/", protect("customer"), createReservation);
reservationRouter.get("/my", protect("customer"), getReservationsByCustomer);

// Staff/Admin
reservationRouter.get("/", protect(["admin", "staff"]), getAllReservations);
reservationRouter.put("/:id/status", protect(["admin", "staff"]), updateReservationStatus);
reservationRouter.delete("/:id", protect(["admin", "staff"]), deleteReservation);

export default reservationRouter;
