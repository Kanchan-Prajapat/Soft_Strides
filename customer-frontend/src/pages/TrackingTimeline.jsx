import "../styles/theme.css";
const TrackingTimeline = ({ history }) => {
  return (
    <div className="timeline">
      {history.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="circle" />
          <div>
            <p>{item.status}</p>
            <small>
              {new Date(item.date).toLocaleString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;
