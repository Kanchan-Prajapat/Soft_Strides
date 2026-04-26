import {
  FaBox,
  FaCheckCircle,
  FaTruck,
  FaHome,
} from "react-icons/fa";
import "./tracking.css";

const getIcon = (status) => {
  switch (status) {
    case "Order Placed":
      return <FaBox />;
    case "Confirmed":
      return <FaCheckCircle />;
    case "Shipped":
      return <FaTruck />;
    case "Out for Delivery":
      return <FaTruck />;
    case "Delivered":
      return <FaHome />;
    default:
      return <FaBox />;
  }
};

const TrackingTimeline = ({ history }) => {
  const lastIndex = history.length - 1;

  return (
    <div className="timeline-container">

      {/* LINE */}
      <div className="timeline-line" />

      {history.map((item, index) => {
        let statusClass = "";

        if (index < lastIndex) statusClass = "completed";
        else if (index === lastIndex) statusClass = "active";
        else statusClass = "pending";

        return (
          <div key={index} className="timeline-step">

            {/* ICON */}
            <div className={`timeline-icon ${statusClass}`}>
              {getIcon(item.status)}
            </div>

            {/* TEXT */}
            <p className="timeline-label">{item.status}</p>

            {index <= lastIndex && (
              <span className="timeline-date">
                {new Date(item.date).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TrackingTimeline;