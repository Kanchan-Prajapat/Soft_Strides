import "../styles/privacy.css"
import SEO from "../components/SEO";
const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
<SEO
  title="Privacy Policy | Soft Strides"
  description="Read the Soft Strides Privacy Policy to learn how we collect, use, store, and protect your personal information, payment details, and shopping data."
  url="https://softstrides.in/privacy-policy"
/>
      {/* HEADER */}
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: March 2026</p>
      </div>
      

      {/* CARD */}
      <div className="privacy-card">

        <p className="intro">
          At Soft Strides, your privacy is our priority. We are committed to
          protecting your personal information and ensuring transparency in how
          we use it.
        </p>

        {/* SECTION 1 */}
        <h3>01. Information We Collect</h3>
        <p>
          We may collect your name, email address, phone number, shipping
          details, and payment information when you place an order or interact
          with our platform.
        </p>

        {/* SECTION 2 */}
        <h3>02. How We Use Your Information</h3>
        <ul>
          <li>✔ To process and deliver your orders</li>
          <li>✔ To improve customer experience</li>
          <li>✔ To send updates, offers, and notifications</li>
        </ul>

        {/* SECTION 3 */}
        <h3>03. Data Protection</h3>
        <p>
          We use secure servers, encryption, and industry-standard practices to
          protect your personal data from unauthorized access.
        </p>

        {/* SECTION 4 */}
        <h3>04. Cookies & Tracking</h3>
        <p>
          We use cookies to enhance your browsing experience, analyze traffic,
          and personalize content. You can disable cookies in your browser
          settings.
        </p>

        {/* SECTION 5 */}
        <h3>05. Third-Party Sharing</h3>
        <p>
          We do not sell your personal data to anyone. Your information is only
          shared with trusted partners for order processing and delivery.
        </p>

        {/* SECTION 6 */}
        <h3>06. Your Rights</h3>
        <p>
          You have the right to access, update, or delete your personal data at
          any time.
        </p>

        {/* CONTACT */}
        <div className="privacy-contact">
          <p>
            Have questions about your privacy?
          </p>
          <span>📩 softstrides7@gmail.com</span>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;