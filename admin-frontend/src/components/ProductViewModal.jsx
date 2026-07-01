import "./ProductModal.css";
import "../styles/theme.css";

const ProductViewModal = ({ product, onClose }) => {

  const hasDiscount =
    product.originalPrice > product.discountPrice;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.discountPrice) /
          product.originalPrice) *
          100
      )
    : 0;

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

        <p>
          <strong>Category:</strong>{" "}
          {product.category?.name || "—"}
        </p>

        {/* PRICE SECTION */}
        <div className="price-box">

          <span className="discount-price">
            ₹{product.discountPrice}
          </span>

          {hasDiscount && (
            <>
              <span className="original-price">
                ₹{product.originalPrice}
              </span>

              <span className="discount-percent">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        <p>
          <strong>Stock:</strong> {product.stock}
        </p>
        <p>
          <strong>Color:</strong> {product.color || "—"}
        </p>

        <div className="highlight-grid">

          <p>
            <strong>Product Category:</strong>{" "}
            {product.category?.name}
          </p>

          <p>
            <strong>Fit:</strong> {product.fit}
          </p>

          <p>
            <strong>Fabric:</strong> {product.fabric}
          </p>

          <p>
            <strong>Length:</strong> {product.length}
          </p>

          <p>
            <strong>Closure:</strong> {product.closure}
          </p>

        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Description:</strong>

          <ul className="desc-list">
            {product.description?.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        <button className="view-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductViewModal;