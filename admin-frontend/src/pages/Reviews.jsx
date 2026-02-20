import { useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "../components/PageLayout";
import "../styles/theme.css"

const Reviews = () => {
  const [products, setProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL; // ✅ MOVE HERE

  const fetchReviews = async () => {
    const token = localStorage.getItem("adminToken");

    const res = await axios.get(`${API_URL}/api/reviews`, {
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
      `${API_URL}/api/reviews/${productId}/${reviewId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <PageLayout title={"Reviews"}>
     <div>
      {products.map((product) =>
        product.reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div>
              <strong>{product.name}</strong>
              <p>{review.comment}</p>
              <small>Status: {review.status}</small>
            </div>

            <div>
              <button className="approve-btn"
                onClick={() =>
                  updateStatus(product._id, review._id, "Approved")
                }
              >
                Approve
              </button>

              <button className="reject-btn"
                onClick={() =>
                  updateStatus(product._id, review._id, "Rejected")
                }
              >
                Reject
              </button>

              <button className="delete-btn"
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
    </PageLayout>
  );
};

export default Reviews;