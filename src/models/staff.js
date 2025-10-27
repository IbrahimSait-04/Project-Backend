import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true , minlength: 6 },
    role: { 
        type: String , enum: ["waiter", "chef", "delivery boy", "receptionist"], required: true 
    },
  },
  { timestamps: true }
);

export const Staff = mongoose.model("Staff", staffSchema);
