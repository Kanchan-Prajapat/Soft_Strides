import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [API_URL]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollLeft += 250;

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth
      ) {
        slider.scrollLeft = 0;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [categories]);

  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 300;
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += 300;
  };

  return (
    <section className="category-section">
      <h2 className="category-title">Shop By Category</h2>

      <div className="category-wrapper">
        <button className="cat-arrow left" onClick={scrollLeft}>
          ❮
        </button>

        <div className="category-slider" ref={scrollRef}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="category-card"
              onClick={() =>
                navigate(`/products?category=${cat._id}`)
              }
            >
              <img src={cat.image} alt={cat.name} />
              <h4>{cat.name}</h4>
            </div>
          ))}
        </div>

        <button className="cat-arrow right" onClick={scrollRight}>
          ❯
        </button>
      </div>
    </section>
  );
};

export default CategorySlider;
