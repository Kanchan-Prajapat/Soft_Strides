import Contact from "../models/Contact.js";

/* =========================
   SEND MESSAGE
========================= */
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    console.error("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

/* =========================
   GET ALL MESSAGES
========================= */
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

/* =========================
   DELETE MESSAGE
========================= */
export const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Message deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
};