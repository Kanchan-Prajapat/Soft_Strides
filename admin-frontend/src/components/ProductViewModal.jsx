import "./ProductModal.css";
import "../styles/theme.css";

const ProductViewModal = ({ product, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{product.name}</h2>

        {product.images?.length > 0 && (
          <div className="product-gallery">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name}-${index}`}
                className="gallery-img"
              />
            ))}
          </div>
        )}

        <p><strong>Category:</strong> {product.category?.name || "—"}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>

        <div className="highlight-grid">
  
     <p><strong>Product Category:</strong> {product.category?.name}</p>
  
    <p> <strong>Fit:</strong> {product.fit}</p>
  
    <p><strong>Fabric:</strong> {product.fabric}</p>
 
    <p><strong>Length:</strong> {product.length}</p>

    <p><strong>Closure:</strong> {product.closure}</p>
  
</div>

        <p style={{ marginTop: 12 }}>
          <strong>Description:</strong><br />
         <ul className="desc-list">
  {product.description?.map((point, i) => (
    <li key={i}>{point}</li>
  ))}
</ul>
        </p>

        <button className="view-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductViewModal;
