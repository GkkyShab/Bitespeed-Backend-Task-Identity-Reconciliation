import mongoose from "mongoose";

const contactModel = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,

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
