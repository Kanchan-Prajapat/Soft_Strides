import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-links">
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/refund-policy">Refund Policy</Link>
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