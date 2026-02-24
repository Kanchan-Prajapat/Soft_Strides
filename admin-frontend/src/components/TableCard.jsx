const TableCard = ({ title, children, right }) => {
  return (
    <div className="card">
        <h3 style={{textAlign:"center"}}>{title}</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    
        {right}
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
};

export default TableCard;
