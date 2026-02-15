import { useState } from "react";
import axios from "axios";

const ReviewForm = ({ productId, refresh }) => {
  const [rating, setRating] = useState(5);
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

      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5,4,3,2,1].map(num => (
          <option key={num} value={num}>
            {num} ⭐
          </option>
        ))}
      </select>

      <textarea
        placeholder="Write review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
};

export default ReviewForm;
