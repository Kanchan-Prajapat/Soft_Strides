import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/theme.css";

const Reviews = () => {
  const [products, setProducts] = useState([]);

  const fetchReviews = async () => {
    const token = localStorage.getItem("adminToken");
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await axios.get(`${API_URL}/api/reviews` , {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducts(res.data);
  };

  const updateStatus = async (productId, reviewId, status) => {
    const token = localStorage.getItem("adminToken");

    await axios.put(
      `${API_URL}/api/reviews/${productId}/${reviewId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchReviews();
  };

  const deleteReview = async (productId, reviewId) => {
    const token = localStorage.getItem("adminToken");

    await axios.delete(
      `${API_URL}/api/reviews/${productId}/${reviewId}` ,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
   <div>
  <h2>All Reviews</h2>

  {products.map((product) =>
    product.reviews.map((review) => (
      <div key={review._id} className="review-card">
        <div className="review-left">
          <img
            src={`${API_URL}${product.image}`}
            alt={product.name}
            className="review-product-img"
          />

          <div>
            <strong>{product.name}</strong>
            <p>{review.comment}</p>
            <small>Status: {review.status}</small>
          </div>
        </div>

        <div className="review-actions">
          <button
            className="btn"
            onClick={() =>
              updateStatus(product._id, review._id, "Approved")
            }
          >
            Approve
          </button>

          <button
            className="btn"
            onClick={() =>
              updateStatus(product._id, review._id, "Rejected")
            }
          >
            Reject
          </button>

          <button
            className="danger-btn"
            onClick={() =>
              deleteReview(product._id, review._id)
            }
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>
  )}

export default Reviews;
