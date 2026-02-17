import { Link } from "react-router-dom";
import "../styles/home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CategorySlider from "../components/CategorySlider";

const Home = () => {
    const [banners, setBanners] = useState([]);
   const [current, setCurrent] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;

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

useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3000);

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

      {/* HERO SECTION */}
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
                {banner.subtitle && <p>{banner.subtitle}</p>}
                <Link to="/products" className="hero-btn">
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
<CategorySlider />

<section className="flash-sale">
  <h2>🔥 Flash Sale</h2>
  <div className="product-grid">
    {/* Map 4 products here */}
  </div>
</section>


      {/* CONTENT SECTION */}
      <div className="container">

       <section className="about-section">

  <div className="about-left">
    <h2>Welcome to Soft Strides 👟</h2>
    <p>
      Discover premium footwear crafted for comfort, performance,
      and modern style. Designed for everyday confidence.
    </p>
  </div>

  <div className="about-right">
    <div className="feature-card">
      <span>✔</span>
      <h4>Premium Materials</h4>
      <p>High-quality fabrics built for durability.</p>
    </div>

    <div className="feature-card">
      <span>🔥</span>
      <h4>Modern Designs</h4>
      <p>Trendy footwear for every occasion.</p>
    </div>

    <div className="feature-card">
      <span>💳</span>
      <h4>Secure Payments</h4>
      <p>Safe and protected checkout process.</p>
    </div>

    <div className="feature-card">
      <span>🔄</span>
      <h4>Easy Returns</h4>
      <p>Hassle-free refund & exchange policy.</p>
    </div>
  </div>

</section>

      </div>
    </div>
  );
};

export default Home;