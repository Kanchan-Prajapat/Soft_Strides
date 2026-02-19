import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareInstagram,
  faSquareFacebook,
  faSquareXTwitter,
  faSquareWhatsapp
} from "@fortawesome/free-brands-svg-icons";

import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LINKS */}
        <div className="footer-links">
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>

        {/* SOCIAL MEDIA */}
<div className="footer-social">

  <a href="https://instagram.com" target="_blank" rel="noreferrer">
    <FontAwesomeIcon icon={faSquareInstagram} />
  </a>

  <a href="https://facebook.com" target="_blank" rel="noreferrer">
    <FontAwesomeIcon icon={faSquareFacebook} />
  </a>

  <a href="https://twitter.com" target="_blank" rel="noreferrer">
    <FontAwesomeIcon icon={faSquareXTwitter} />
  </a>

  <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
    <FontAwesomeIcon icon={faSquareWhatsapp} />
  </a>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-copy">
          © 2026 Soft Strides. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
