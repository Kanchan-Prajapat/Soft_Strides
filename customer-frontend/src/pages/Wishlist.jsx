import "../styles/contact.css";
import { useState } from "react";
import { sendMessage } from "../api/contact";

const Contact = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  /* ======================
     HANDLE CHANGE
  ====================== */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ======================
     HANDLE SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSuccessMsg("Please fill all required fields ⚠️");
      return;
    }

    try {
      setLoading(true);

      await sendMessage(formData);

      setSuccessMsg("Message sent successfully ✅");

      // reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
      setSuccessMsg("Failed to send message ❌");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    }
  };

  return (
    <div className="contact-page container">
      
      {/* HEADER */}
      <div className="contact-header">
        <h1>LET’S CONNECT</h1>
        <p>
          Have a question about your fit? Or just want to say hi?
          We’re always here to help.
        </p>
      </div>

      <div className="contact-grid">

        {/* LEFT */}
        <div className="contact-info card">
          <h3>Contact Info</h3>

          <p><strong>Email:</strong> softstrides7@gmail.com</p>
          <p><strong>Phone:</strong> +91 8690709955</p>

          <p className="support-time">
            Mon-Sat | 10 AM to 6 PM IST
          </p>

          <div className="trust-box">
            <div>🚚 Fast Dispatch</div>
            <div>🔒 Secure Payment</div>
            <div>⭐ Premium Quality</div>
          </div>
        </div>

        {/* FORM */}
        <form className="contact-form card" onSubmit={handleSubmit}>
          
          {successMsg && (
            <p className="success-message">{successMsg}</p>
          )}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          >
            <option value="">What's on your mind?</option>
            <option>Order Status</option>
            <option>Custom Design</option>
            <option>Bulk Inquiry</option>
            <option>Other</option>
          </select>

          <textarea
            name="message"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2>FAQ</h2>

        <details>
          <summary>How do I track my order?</summary>
          <p>You will receive a tracking link via email after shipping.</p>
        </details>

        <details>
          <summary>Do you offer custom T-shirts?</summary>
          <p>Yes, we support custom designs and bulk orders.</p>
        </details>

        <details>
          <summary>What is your return policy?</summary>
          <p>We offer 7-day easy returns for eligible products.</p>
        </details>
      </div>
    </div>
  );
};

export default Contact;