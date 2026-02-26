import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "../styles/flashSale.css";

const FlashSaleSection = () => {
  const [sale, setSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/flash-sales`);
        setSale(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFlashSale();
  }, [API_URL]);

  // ⏳ Countdown Timer
  useEffect(() => {
    if (!sale?.endDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(sale.endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setExpired(true);
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sale]);

  if (!sale || sale.products.length === 0)
    return (
      <div className="No-active">
        <p>No active flash sale</p>
      </div>
    );

  return (
    <section className="flash-sale-section">
      <div className="container">

        {/* Header */}
        <div className="flash-header">
          <h2>🔥 Flash Sale</h2>

          {expired ? (
            <div className="timer-box timer-expired">
              Flash Sale Ended
            </div>
          ) : (
            <div className="timer-box timer-active">
              Ends in {timeLeft}
            </div>
          )}
        </div>

        {/* Products */}
        <div
          className={`flash-products-grid ${
            sale.products.length === 1 ? "single-product" : ""
          }`}
        >
          {sale.products.map((product) => {
            const originalPrice = product.price;
            const discount = sale.discountPercentage || 0;

            const discountedPrice =
              originalPrice - (originalPrice * discount) / 100;

            return (
              <div
                className={`flash-card-wrapper ${
                  expired ? "flash-expired" : ""
                }`}
                key={product._id}
              >
                <span className="discount-badge">
                  -{discount}%
                </span>

                <ProductCard
                  product={product}
                  discountedPrice={discountedPrice.toFixed(0)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;