import { Link } from "react-router-dom";
import "../styles/home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CategorySlider from "../components/CategorySlider";
import FlashSaleSection from "../components/FlashSaleSection";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;

  /* =============================
        FETCH BANNERS
  ============================= */

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/banners`);
        setBanners(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBanners();
  }, [API_URL]);

  /* =============================
        AUTO SLIDER
  ============================= */

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  return (
    <div className="home-page">

      {/* ================= HERO SLIDER ================= */}

      {banners.length > 0 && (
        <section className="hero-slider">

          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`slide ${
                index === current ? "active" : ""
              }`}
            >
              <img src={banner.image} alt="banner" />

              <div className="hero-content">
                <h1>{banner.title}</h1>

                {banner.subtitle && (
                  <p>{banner.subtitle}</p>
                )}
                <h2 style={{marginBottom:"20px", marginTop:"-30px", marginLeft:"10PX"}}>{banner.description}</h2>

                <Link
                  to="/products"
                  className="hero-btn"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button className="arrow left" onClick={prevSlide}>
            ❮
          </button>

          <button className="arrow right" onClick={nextSlide}>
            ❯
          </button>

        </section>
      )}

      {/* ================= CATEGORY SECTION ================= */}
      <CategorySlider />

      {/* ================= FLASH SALE ================= */}
      <FlashSaleSection />

      {/* ================= PREMIUM BRAND SECTION ================= */}

      <section className="premium-hero">
        <div className="container hero-container">

          {/* LEFT SIDE */}
          <div className="hero-left">
            <h1>
              Welcome to <span>Soft Strides</span>
            </h1>

            <p>
              Discover premium footwear crafted for comfort,
              performance, and modern style.
              Designed for everyday confidence.
            </p>

            <Link
              to="/products"
              className="hero-cta-btn"
            >
              Shop Collection →
            </Link>
          </div>

          {/* RIGHT SIDE FEATURES */}
          <div className="hero-right">

            <div className="hero-feature-card">
              <div className="hero-feature-icon">✓</div>
              <h3>Premium Materials</h3>
              <p>
                High-quality fabrics built for
                durability and comfort.
              </p>
            </div>

            <div className="hero-feature-card">
              <div className="hero-feature-icon">🔥</div>
              <h3>Modern Designs</h3>
              <p>
                Trend-driven styles for every
                occasion and season.
              </p>
            </div>

            <div className="hero-feature-card">
              <div className="hero-feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>
                Encrypted and protected checkout
                experience.
              </p>
            </div>

            <div className="hero-feature-card">
              <div className="hero-feature-icon">🔁</div>
              <h3>Easy Returns</h3>
              <p>
                Hassle-free exchange and refund
                process.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
