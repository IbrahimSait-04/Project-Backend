import { Staff } from "../models/staff.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "14d" });
};

// STAFF LOGIN
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email, password);

    const staff = await Staff.findOne({ email: email.toLowerCase() });
    if (!staff) {
      console.log(" Staff not found");
      return res.status(404).json({ message: "Staff not found" });
    }

    console.log(" Found staff:", staff.email);
    console.log("Stored hash:", staff.password);

    const isMatch = await bcrypt.compare(password, staff.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(staff._id, "staff");

    res.status(200).json({
      message: "Staff login successful",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({ message: error.message });
  }
};


// UPDATE STAFF PROFILE
export const updateStaffProfile = async (req, res) => {
  const staff = req.user; // ✅ use req.user from middleware
  const { email, password } = req.body;

  try {
    if (email) staff.email = email.toLowerCase();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(password, salt); // hash before saving
    }
    await staff.save();

    res.status(200).json({
      message: "Staff profile updated successfully",
      staff: {
        id: staff._id,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET STAFF PROFILE
export const getStaffProfile = async (req, res) => {
  const staff = req.user; // ✅ use req.user
  res.status(200).json({
    staff: {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    },
  });
};
