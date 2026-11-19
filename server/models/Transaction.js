const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    text:     { type: String, required: true, trim: true },
    amount:   { type: Number, required: true },
    category: {
      type: String,
      enum: ["Food", "Transport", "Shopping", "Entertainment", "Health", "Salary", "Other"],
      default: "Other",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
