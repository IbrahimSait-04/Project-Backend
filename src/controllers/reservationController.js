import { Reservation } from "../models/reservation.js";

/*  CREATE RESERVATION (Customer) */
export const createReservation = async (req, res) => {
  try {
    const { date, time, partySize } = req.body;

    if (!date || !time || !partySize) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      date,
      time,
      partySize,
      status: "pending",
    });

    res.status(201).json({
      message: "✅ Reservation created successfully.",
      reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/* GET ALL RESERVATIONS (Admin/Staff) */
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/*  GET RESERVATIONS BY CUSTOMER */
export const getReservationsByCustomer = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/* UPDATE RESERVATION STATUS (Admin/Staff) */
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found." });

    reservation.status = status;
    await reservation.save();

    res.status(200).json({
      message: `Reservation status updated to ${status}`,
      reservation,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/*  DELETE RESERVATION (Admin/Staff) */
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found." });

    await reservation.deleteOne();
    res.status(200).json({ message: "Reservation deleted successfully." });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
