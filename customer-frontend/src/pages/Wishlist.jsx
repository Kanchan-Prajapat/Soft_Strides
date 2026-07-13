import "../styles/wishlist.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import SEO from "../components/SEO";
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  /* ======================
     FETCH WISHLIST
  ====================== */
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist");
        setWishlist(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWishlist();
  }, []);

  /* ======================
     REMOVE
  ====================== */
  const removeFromWishlist = async (id) => {
    try {
      const res = await API.post(`/wishlist/${id}`);
      setWishlist(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ======================
     BUY NOW
  ====================== */
  const handleBuyNow = async (product) => {
    try {
      await API.post("/cart", {
        productId: product._id,
        size: "M",
        quantity: 1,
        buyNow: true,
      });

      navigate("/checkout?type=buyNow");
    } catch (err) {
      console.log(err);
    }
  };

  /* ======================
     MOVE TO CART (WITH SIZE)
  ====================== */
  const handleMoveToCart = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const confirmAddToCart = async () => {
    if (!selectedSize) {
      alert("Select size");
      return;
    }

    await API.post("/cart", {
      productId: selectedProduct._id,
      size: selectedSize,
      quantity: 1,
    });

    await removeFromWishlist(selectedProduct._id);

    setShowPopup(false);
    setSelectedSize("");
  };

  return (
    <div className="wishlist-page">
    <SEO
  title="My Wishlist | Soft Strides"
  description="View and manage your saved favorite products in your Soft Strides wishlist."
  url="https://softstrides.in/wishlist"
  robots="noindex,nofollow"
/>
      <h2>Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items</p>
      ) : (
        <div className="wishlist-grid">

          {wishlist.map((item) => (
            <div className="wishlist-row" key={item._id}>

              {/* IMAGE */}
              <div
                className="wishlist-image"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="premium-image-wrapper" style={{ width: 120, minWidth: 120 }}>
                  <img src={item.image || item.images?.[0]} alt={item.name} className="premium-image" />
                </div>
              </div>

              {/* CONTENT */}
              <div className="wishlist-content">

                <div className="left">
                  <h3>{item.name}</h3>
                  <p>₹{item.discountPrice}</p>
                </div>

                <div className="right">

                  <button onClick={() => handleMoveToCart(item)}>
                    Move
                  </button>

                  <button
                    className="buy-btn"
                    onClick={() => handleBuyNow(item)}
                  >
                    Buy Now
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* SIZE POPUP */}
      {showPopup && (
        <div className="popup">
          <div className="box">
            <h3>Select Size</h3>

            <div className="sizes">
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  className={selectedSize === s ? "active" : ""}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <button onClick={confirmAddToCart}>Add</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;