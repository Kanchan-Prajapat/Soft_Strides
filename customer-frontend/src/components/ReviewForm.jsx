import { useState } from "react";
import axios from "axios";
import "../styles/productDetails.css";

const ReviewForm = ({ productId, refresh }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);

  const submitReview = async () => {
    const token = localStorage.getItem("userToken");
    const API_URL = process.env.REACT_APP_API_URL;

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("photo", photo);

    try {
      await axios.post(
        `${API_URL}/api/reviews/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Review submitted!");
      refresh();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="review-form">
      <h4>Write Review</h4>

      {/* ⭐ STAR RATING */}
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${
              star <= (hover || rating) ? "active" : ""
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        placeholder="Write review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      <button onClick={submitReview}>
        Submit Review
      </button>
    </div>
  );
};

export default ReviewForm;