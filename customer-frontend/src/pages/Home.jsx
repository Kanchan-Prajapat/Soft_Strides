import { Link } from "react-router-dom";
import "../styles/home.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [banner, setBanner] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/banners`);
        if (res.data && res.data.length > 0) {
          setBanner(res.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBanner();
  }, [API_URL]);

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      {banner && (
        <div className="hero-section">
          <img
            src={banner.image}
            alt="Banner"
            className="hero-image"
          />

          <div className="hero-overlay">
            <h1>{banner.title}</h1>
            <Link to="/products" className="hero-btn">
              SHOP NOW
            </Link>
          </div>
        </div>
      )}

      {/* CONTENT SECTION */}
      <div className="container">

        <section className="welcome-section">
          <h2>Welcome to Soft Strides 👟</h2>
          <p>
            Discover premium footwear designed for comfort, style,
            and durability. Elevate your everyday fashion with us.
          </p>
        </section>

        <section className="why-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>✔ High-quality materials</li>
            <li>✔ Trendy & modern designs</li>
            <li>✔ Affordable pricing</li>
            <li>✔ Secure payments</li>
            <li>✔ Easy returns & refunds</li>
          </ul>
        </section>

        <section className="products-section">
          <h2>Our Products</h2>
          <p>
            Explore casual wear, sports shoes, sneakers, and formal footwear
            crafted for every occasion.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Home;