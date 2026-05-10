import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ReviewForm from "../components/ReviewForm";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/productDetails.css"
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { FaHeart } from "react-icons/fa";
import CartDrawer from "../components/CartDrawer";
import { useSwipeable } from "react-swipeable";
import { Truck, RefreshCcw, Package } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ ALL STATES AT TOP
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [fetchProduct, setFetchProduct] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [currentImage, setCurrentImage] = useState(0);
  const hasSizes = product?.sizes?.length > 0;
  const [fullView, setFullView] = useState(false);

  const refresh = () => setFetchProduct((prev) => !prev);
  const navigate = useNavigate();

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/products/${id}`
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProductData();
  }, [id, fetchProduct, API_URL]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    },
    onSwipedRight: () => {
      setCurrentImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    },
  });

  useEffect(() => {
    if (showPopup) {
      setTimeout(() => setShowPopup(false), 2000);
    }
  }, [showPopup]);


  useEffect(() => {
    const fetchRelated = async () => {
      try {
        if (!product?.category) return;

        const res = await axios.get(
          `${API_URL}/api/products/related/${product.category._id}`
        );

        setRelatedProducts(res.data);
      } catch (err) {
        console.log("Related error:", err);
      }
    };

    fetchRelated();
  }, [product, API_URL]);



  if (!product) {
    return <div className="container">Loading product...</div>;
  }


  const isInCart = cartItems?.some(
    (item) =>
      item._id === product._id &&
      item.size === (hasSizes ? selectedSize : "Free Size")
  );

  const hasDiscount =
    product.originalPrice > product.discountPrice;

  const discountPercent = hasDiscount
    ? Math.round(
      ((product.originalPrice - product.discountPrice) /
        product.originalPrice) *
      100
    )
    : 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      alert("Please select size first ⚠️");
      return;
    }
    if (isInCart) {
      navigate("/cart");
      return;
    }

    addToCart({
      ...product,
      size: hasSizes ? selectedSize : "Free Size",
      qty: 1,
    });

    setShowPopup(true);
  };

  return (
    <div className="product-page">

      {/* TOP SECTION */}
      <div className="product-wrapper">

        {/* LEFT SIDE */}
        <div className="details-left">

          {/* LEFT THUMBNAILS */}
          <div className="thumbnail-column">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.name}
                onClick={() => setCurrentImage(i)}
                className={`thumb ${currentImage === i ? "active-thumb" : ""}`}
              />
            ))}
          </div>

          <div>
            {/* MAIN IMAGE */}
            <div className="main-image" {...handlers}>
              <img
                src={product.images[currentImage]}
                alt={product.name}
                onClick={() => setFullView(true)}
              />
            </div>

            <div className="image-dots">
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={i === currentImage ? "active-dot" : "dot"}
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>
          </div>

        </div>
        {/* RIGHT SIDE */}
        <div className="details-right">
          <h1>{product.name}</h1>

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

          <div className="description">
            <h4>Product Highlights</h4>

            <ul>
              {product.description?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="key-highlights">
            <h3>Key Highlights</h3>

            <div className="highlight-grid">
              <div>
                <span>Fit</span>
                <p>{product.fit}</p>
              </div>

              <div>
                <span>Fabric</span>
                <p>{product.fabric}</p>
              </div>

              <div>
                <span>Length</span>
                <p>{product.length}</p>
              </div>

              <div>
                <span>Closure</span>
                <p>{product.closure}</p>
              </div>
            </div>
          </div>

          <div className="size-section">
            {hasSizes && <h4>Select Size</h4>}

            {product?.sizes?.length > 0 ? (
              product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""
                    }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))
            ) : (
              <button className="size-btn active">Free Size</button>
            )}
          </div>

          <div className="product-actions">
            {isInCart ? (
              <button
                className="add-cart"
                onClick={() => setCartOpen(true)}
              >
                View Cart
              </button>
            ) : (
              <button
                className="add-cart"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            )}
          </div>



        </div>

        {/* 🔥 FEATURE STRIP (TOP) */}
        <div className="feature-strip">
          <div className="feature-item">
            <Truck size={45} />
            <p>Free Shipping</p>
            <span>3–7 Days</span>
          </div>

          <div className="feature-item">
            <RefreshCcw size={45} />
            <p>7 Days Return</p>
            <span>Easy Exchange</span>
          </div>

          <div className="feature-item">
            <Package size={45} />
            <p>Fast Dispatch</p>
            <span>24–48 hrs</span>
          </div>
        </div>

        {/* 🔥 DETAILED INFO (BOTTOM) */}
        <div className="product-extra-info">

          <div className="info-box">
            <h4><Truck size={18} /> Shipping Info</h4>
            <ul>
              <li>Free shipping on prepaid orders</li>
              <li>Dispatch within 24–48 hours</li>
              <li>Delivery in 3–7 days</li>
              <li>Live tracking available</li>
            </ul>
          </div>

          <div
            className="info-box clickable"
            onClick={() => navigate("/returns-policy")}
          >
            <h4><RefreshCcw size={18} /> Returns & Exchange</h4>
            <p>7 days easy return policy</p>
          </div>

        </div>

      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {product.reviews
            ?.filter((r) => r.status === "Approved")
            .map((review) => (
              <div key={review._id} className="review-box">

                <div className="review-header">
                  <strong>{review.name}</strong>
                  <span>{"⭐".repeat(review.rating)}</span>
                </div>

                <p>{review.comment}</p>

                {review.photo && (
                  <img
                    src={review.photo}
                    alt="review"
                    className="review-photo"
                  />
                )}

                <button
                  disabled={review.helpfulUsers?.includes(user?._id)}
                  onClick={async () => {
                    try {
                      const token =
                        localStorage.getItem("userToken");

                      await axios.put(
                        `${API_URL}/api/reviews/helpful/${product._id}/${review._id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      refresh();
                    } catch (err) {
                      alert(err.response?.data?.message);
                    }
                  }}
                >
                  👍 Helpful ({review.helpfulCount})
                </button>
              </div>
            ))}
        </div>

        {/* Write Review - OUTSIDE GRID */}
        <div className="write-review-wrapper">
          <ReviewForm
            productId={product._id}
            refresh={refresh}
          />
        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <div className="related-section">
        <h2>You May Also Like</h2>

        <div className="related-grid">
          {relatedProducts.map((item) => (
            <div
              key={item._id}
              className="related-card"
              onClick={() => navigate(`/product/${item._id}`)}
            >

              {/* ❤️ WISHLIST ICON */}
              <div
                className={`wishlist-icon ${isInWishlist(item._id) ? "active" : ""
                  }`}
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 prevent redirect
                  toggleWishlist(item);
                }}
              >
                <FaHeart />
              </div>

              <img src={item.images?.[0]} alt={item.name} />
              <h4>{item.name}</h4>
              <div className="related-price-box">

                <span className="related-main-price">
                  ₹{item.discountPrice}
                </span>

                {item.originalPrice > item.discountPrice && (
                  <>
                    <span className="related-old-price">
                      ₹{item.originalPrice}
                    </span>

                    <span className="related-discount">
                      {Math.round(
                        ((item.originalPrice - item.discountPrice) /
                          item.originalPrice) *
                        100
                      )}% OFF
                    </span>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      {fullView && (
        <div className="image-modal">

          {/* CLOSE BUTTON */}
          <span className="close-btn" onClick={() => setFullView(false)}>
            ✕
          </span>

          {/* LEFT ARROW */}
          <button
            className="modal-arrow left"
            onClick={() =>
              setCurrentImage(
                currentImage === 0
                  ? product.images.length - 1
                  : currentImage - 1
              )
            }
          >
            ❮
          </button>

          {/* IMAGE */}
          <img
            src={product.images[currentImage]}
            alt="full view"
            className="modal-image"
          />

          {/* RIGHT ARROW */}
          <button
            className="modal-arrow right"
            onClick={() =>
              setCurrentImage(
                currentImage === product.images.length - 1
                  ? 0
                  : currentImage + 1
              )
            }
          >
            ❯
          </button>

        </div>
      )}


      {showPopup && (
        <div className="popup">
          ✅ Added to cart successfully

          <button onClick={() => setShowPopup(false)}>
            OK
          </button>
        </div>
      )}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />


    </div>


  );


};

export default ProductDetails;