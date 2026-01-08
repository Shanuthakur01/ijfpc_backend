// src/models/RoleSetting.js
import mongoose from "mongoose";

const RoleSettingSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      enum: ["FEE_STAFF", "PLACEMENT_STAFF", "FOUNDER"],
      required: true,
      unique: true,
      index: true,
    },
    passwordPlain: {
      // NOTE: You requested that Super Admin can VIEW the password.
      // If you want to be more secure later, we can store encrypted instead.
      type: String,
      required: true,
    },
    enabled: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("RoleSetting", RoleSettingSchema);
