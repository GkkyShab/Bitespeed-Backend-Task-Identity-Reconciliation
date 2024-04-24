import mongoose from "mongoose";

const contactModel = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    linkedId: {
      type: Number,
    },
    linkPrecedence: {
      type: String,
      enum: ["primary", "secondary"],
      default: "primary",
    },
  },
  { timestamps: true, deletedAt: true }
);

const Contact = mongoose.model("Contact", contactModel);

export default Contact;