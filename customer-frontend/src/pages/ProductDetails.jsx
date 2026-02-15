import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import ReviewForm from "../components/ReviewForm";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("");
    const [fetchProduct, setFetchProduct] = useState(false);
    const refresh = () => setFetchProduct((prev) => !prev);
    const { user } = useAuth();
     const API_URL = process.env.REACT_APP_API_URL;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select size");
            return;
        }

        addToCart({
            ...product,
            qty: 1,
            size: selectedSize
        });

        alert("Added to cart");
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className="container">Loading product...</div>;
    }

    return (
        <div className="container product-details">
            <div className="details-grid">
                <div>
                    <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="details-image"
                    />
                </div>

                <div>
                    <h2>{product.name}</h2>
                    <p className="price">₹{product.price}</p>
                    <p>{product.description}</p>
                    <div className="size-section">
                        <h4>Select Size</h4>

                        <div className="size-options">
                            {product.sizes?.map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>


                    <button
                        className="btn-primary"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>

                </div>

                <h3>Customer Reviews</h3>

                {product.reviews
                    ?.filter((r) => r.status === "Approved")
                    .map((review) => (
                        <div key={review._id} className="review-box">
                            <strong>{review.name}</strong>
                            <p>{"⭐".repeat(review.rating)}</p>
                            <p>{review.comment}</p>

                            {review.photo && (
                                <img
                                    src={review.photo}
                                    alt="review"
                                    style={{ width: "120px", marginTop: "10px" }}
                                />
                            )}

                            <button
                                disabled={review.helpfulUsers?.includes(user?._id)}
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("userToken");

                                        await axios.put(
                                            `${API_URL}/api/reviews/helpful/${product._id}/${review._id}`,
                                            {},
                                            {
                                                headers: { Authorization: `Bearer ${token}` },
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

                <ReviewForm productId={product._id} refresh={fetchProduct} />

            </div>
        </div>
    );
};

export default ProductDetails;
