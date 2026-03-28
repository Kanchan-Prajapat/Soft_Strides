import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);