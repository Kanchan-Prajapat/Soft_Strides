import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/WhatsApp.css"

const WhatsAppFloat = () => {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => {
      setShowBubble(true);
    }, 2500);

    const hide = setTimeout(() => {
      setShowBubble(false);
    }, 8000);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const phone = "8824469405"; // Replace with client's WhatsApp number

  const message =
    "Hi Soft Strides 👋%0A%0AI'm interested in your products.%0ACan you help me?";

  const whatsappLink = `https://wa.me/+91${phone}?text=${message}`;

  return (
    <div className="whatsapp-container">
      {showBubble && (
        <div className="whatsapp-bubble">
          <strong>Need Help?</strong>
          <span>Chat with us on WhatsApp</span>
        </div>
      )}

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default WhatsAppFloat;