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

        <p style={{ marginTop: 12 }}>
          <strong>Description:</strong><br />
          {product.description}
        </p>

        <button className="view-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductViewModal;
