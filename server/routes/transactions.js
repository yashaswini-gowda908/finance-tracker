const express     = require("express");
const router      = express.Router();
const Transaction = require("../models/Transaction");
const auth        = require("../middleware/auth");

// ADD
router.post("/", auth, async (req, res) => {
  try {
    const { text, amount, category } = req.body;
    if (!text || amount === undefined)
      return res.status(400).json({ message: "Text and amount are required" });

    const t = await new Transaction({
      text, amount, category: category || "Other", userId: req.user.id,
    }).save();
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all for user
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const t = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!t) return res.status(404).json({ message: "Not found" });
    await t.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
