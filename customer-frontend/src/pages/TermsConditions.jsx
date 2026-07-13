import "../styles/privacy.css";
import SEO from "../components/SEO";
const TermsConditions = () => {
  return (
    <div className="privacy-container">
<SEO
  title="Terms & Conditions | Soft Strides"
  description="Read the Soft Strides Terms & Conditions to understand the rules for using our website, placing orders, payments, returns, exchanges, and other legal information."
  url="https://softstrides.in/terms"
/>
      {/* HEADER */}
      <div className="privacy-header">
        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last Updated: March 2026</p>
      </div>

      {/* CARD */}
      <div className="privacy-card">

        {/* TLDR */}
        <div className="tldr-box">
          <strong>Quick Summary:</strong>  
          By using Soft Strides, you agree to our terms. We aim to provide a
          smooth shopping experience while protecting both you and our brand.
        </div>

        <p className="intro">
          By accessing or using our website, you agree to comply with and be
          bound by the following terms and conditions.
        </p>

        {/* SECTION 1 */}
        <h3>01. Orders</h3>
        <p>
          Orders are confirmed only after successful payment verification. We
          reserve the right to cancel or refuse any order if necessary.
        </p>

        {/* SECTION 2 */}
        <h3>02. Pricing</h3>
        <p>
          Prices are subject to change without prior notice. We strive to ensure
          accurate pricing, but errors may occur.
        </p>

        {/* SECTION 3 */}
        <h3>03. User Responsibilities</h3>
        <ul>
          <li>✔ Provide accurate personal and shipping details</li>
          <li>✔ Do not misuse the website or attempt fraudulent activity</li>
          <li>✔ Maintain confidentiality of your account credentials</li>
        </ul>

        {/* SECTION 4 */}
        <h3>04. Intellectual Property</h3>
        <p>
          All content on this website, including logos, images, and design, is
          the property of Soft Strides and may not be used without permission.
        </p>

        {/* SECTION 5 */}
        <h3>05. Limitation of Liability</h3>
        <p>
          Soft Strides is not liable for any indirect damages, delays, or issues
          caused by external factors such as logistics or technical failures.
        </p>

        {/* SECTION 6 */}
        <h3>06. Governing Law</h3>
        <p>
          These terms are governed by the laws of India. Any disputes will be
          subject to the jurisdiction of local courts.
        </p>

        {/* CONTACT */}
        <div className="privacy-contact">
          <p>Questions about these terms?</p>
          <span>📩 softstrides7@gmail.com</span>
        </div>

      </div>
    </div>
  );
};

export default TermsConditions;