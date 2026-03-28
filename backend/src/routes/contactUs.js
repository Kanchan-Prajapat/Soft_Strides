import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// ✅ POST (save message)
router.post("/", async (req, res) => {
  try {
    const newMessage = await Contact.create(req.body);
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET (admin ke liye)
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

router.post("/", async (req, res) => {
  try {
    console.log("🔥 DATA:", req.body);

    const newMessage = await Contact.create(req.body);

    console.log("✅ SAVED:", newMessage);

    res.json(newMessage);
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});