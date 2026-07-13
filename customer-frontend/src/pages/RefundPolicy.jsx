import "../styles/privacy.css";
import SEO from "../components/SEO";
const RefundPolicy = () => {
  return (
    <div className="privacy-container">
<SEO
  title="Refund & Return Policy | Soft Strides"
  description="Read the Soft Strides Refund & Return Policy to understand our return eligibility, exchange process, refund timelines, and terms for purchases made on our website."
  url="https://softstrides.in/refund-policy"
/>
      {/* HEADER */}
      <div className="privacy-header">
        <h1>Refund Policy</h1>
        <p className="last-updated">Last Updated: March 2026</p>
      </div>

      {/* CARD */}
      <div className="privacy-card">

        {/* PROCESS FLOW */}
        <div className="refund-steps">
          <div>📦 Request Return<br /><span>Within 7 days</span></div>
          <div>🔍 Quality Check<br /><span>Product inspection</span></div>
          <div>💳 Refund Issued<br /><span>5-7 business days</span></div>
        </div>

        {/* RETURNS */}
        <h3>01. Returns</h3>
        <p>
          Customers can request a return within <strong>7 days</strong> of delivery.
          The product must be unused, unwashed, and in original condition.
        </p>

        {/* REFUND PROCESS */}
        <h3>02. Refund Process</h3>
        <p>
          Once we receive and inspect your product, the refund will be processed.
          The amount will be credited within <strong>5-7 business days</strong>
          to your original payment method.
        </p>

        {/* EXCHANGE */}
        <h3>03. Exchange Policy</h3>
        <p>
          We offer easy exchanges for size or fit issues. Exchange requests must
          be raised within 7 days of delivery.
        </p>

        {/* CANCELLATION */}
        <h3>04. Cancellation Policy</h3>
        <p>
          Orders can be cancelled before they are shipped. Once shipped,
          cancellation is not possible.
        </p>

        {/* NON REFUNDABLE */}
        <h3>05. Non-refundable Items</h3>
        <p>
          Used, damaged, or altered products are not eligible for refunds or exchanges.
        </p>

        {/* SHIPPING */}
        <h3>06. Return Shipping</h3>
        <p>
          Return pickup will be arranged by us wherever available. In some cases,
          customers may need to ship the product back.
        </p>

        {/* CONTACT */}
        <div className="privacy-contact">
          <p>Need help with returns?</p>
          <span>📩 softstrides7@gmail.com</span>
        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;