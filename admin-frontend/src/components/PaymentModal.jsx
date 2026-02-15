import { verifyPayment, rejectPayment } from "../api/orders";
import "../styles/theme.css";

const PaymentModal = ({ payment, onClose, onUpdate }) => {
  const handleVerify = async () => {
    await verifyPayment(payment._id);
    onUpdate();
    onClose();
  };

  const handleReject = async () => {
    await rejectPayment(payment._id);
    onUpdate();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Payment Details</h2>

        <p><b>Customer:</b> {payment.user?.name}</p>
        <p><b>Email:</b> {payment.user?.email}</p>
        <p><b>Total:</b> ₹{payment.totalAmount}</p>
        <p><b>Status:</b> {payment.paymentStatus}</p>

        <h4 style={{ marginTop: 20 }}>Payment Screenshot</h4>

        <img
          src={payment.paymentScreenshot}
          alt="Payment"
          style={{
            width: "100%",
            borderRadius: 10,
            marginTop: 10,
            border: "1px solid #222",
          }}
        />

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
          }}
        >
          {payment.paymentStatus !== "Verified" && (
            <>
              <button className="btn" onClick={handleVerify}>
                Verify
              </button>

              <button
                className="btn"
                style={{ borderColor: "#555" }}
                onClick={handleReject}
              >
                Reject
              </button>
            </>
          )}

          <button
            className="btn"
            style={{ borderColor: "#444" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
