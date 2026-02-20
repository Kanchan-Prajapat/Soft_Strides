import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ReviewForm from "../components/ReviewForm";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/productDetails.css"

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ ALL STATES AT TOP
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [fetchProduct, setFetchProduct] = useState(false);

  const refresh = () => setFetchProduct((prev) => !prev);

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
  }, [id, fetchProduct,API_URL]);


  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);


  if (!product) {
    return <div className="container">Loading product...</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select size");
      return;
    }

    addToCart({
      ...product,
      qty: 1,
      size: selectedSize,
    });

    alert("Added to cart 🛒");
  };

  return (
    <div className="product-page">

      {/* TOP SECTION */}
      <div className="product-wrapper">

        {/* LEFT SIDE */}
        <div className="details-left">
          <img
            src={mainImage}
            alt={product.name}
            className="main-image"
          />

          <div className="thumbnail-row">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                className="thumb"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="details-right">
          <h1>{product.name}</h1>

          <p className="price">₹{product.price}</p>

          <p className="description">{product.description}</p>

          <div className="size-section">
            <h4>Select Size</h4>

            <div className="size-options">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            className="add-cart"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

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
                    alert(
                      err.response?.data?.message
                    );
                  }
                }}
              >
                👍 Helpful ({review.helpfulCount})
              </button>
            </div>
          ))}

        <ReviewForm
          productId={product._id}
          refresh={refresh}
        />
      </div>
    </div>
  );
};

export default ProductDetails;