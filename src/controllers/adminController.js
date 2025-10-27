import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.js";
import { Staff } from "../models/staff.js";
import { Menu } from "../models/menu.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const roles = ["waiter", "chef", "delivery boy", "receptionist"];

// Create Admin
export const adminCreate = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id, "admin");

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = req.user; // already fetched by middleware
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Admin Profile 
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = req.user; // already fetched by middleware
    if (!admin) return res.status(401).json({ message: "Not authorized" });

    const { name, email, password } = req.body;
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = await bcrypt.hash(password, 10);

    await admin.save();

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Staff
export const createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check role validity
    if (!role || !roles.includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    const staffExists = await Staff.findOne({ email });
    if (staffExists) return res.status(400).json({ message: "Staff already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = new Staff({ name, email, password: hashedPassword, role });
    await staff.save();

    res.status(201).json({ 
      message: "Staff created successfully", 
      staff: { id: staff._id, name: staff.name, email: staff.email, role: staff.role } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Staff 
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    if (name) staff.name = name;
    if (email) staff.email = email;
    if (password) staff.password = await bcrypt.hash(password, 10);
    if (role) {
      if (!roles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      staff.role = role;
    }

    await staff.save();
    res.status(200).json({ message: "Staff updated successfully", staff: { id: staff._id, name: staff.name, email: staff.email, role: staff.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Staff 
export const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password");
    res.status(200).json({ staff: staffList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Staff 
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    await staff.deleteOne();
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
