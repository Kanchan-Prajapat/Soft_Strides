import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const CategorySlider = () => {
const [categories, setCategories] = useState([]);
const scrollRef = useRef(null);
const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL;

/* ================= FETCH ================= */
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

/* ================= SMOOTH CENTER SCALE ================= */
useEffect(() => {
  const slider = scrollRef.current;
  if (!slider) return;

  const handleScroll = () => {
    const cards = slider.querySelectorAll(".category-card");

    const center = slider.scrollLeft + slider.offsetWidth / 2;

    cards.forEach((card) => {
      const cardCenter =
        card.offsetLeft + card.offsetWidth / 2;

      const distance = Math.abs(center - cardCenter);

const threshold = slider.offsetWidth / 4;

if (distance < threshold) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  };

  slider.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => slider.removeEventListener("scroll", handleScroll);
}, []);

/* ================= AUTO SCROLL (SMOOTH) ================= */
useEffect(() => {
  const slider = scrollRef.current;
  if (!slider) return;

  let interval;
  let isPaused = false;

  const startAutoScroll = () => {
    interval = setInterval(() => {
      if (isPaused) return;

      const cardWidth = getCardWidth();

      slider.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });

      // infinite reset
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }
    }, 2500); // every 2.5 sec
  };

  startAutoScroll();

  const pause = () => (isPaused = true);
  const resume = () => (isPaused = false);

  slider.addEventListener("mouseenter", pause);
  slider.addEventListener("mouseleave", resume);
  slider.addEventListener("touchstart", pause);
  slider.addEventListener("touchend", resume);

  return () => {
    clearInterval(interval);
    slider.removeEventListener("mouseenter", pause);
    slider.removeEventListener("mouseleave", resume);
    slider.removeEventListener("touchstart", pause);
    slider.removeEventListener("touchend", resume);
  };
}, [categories]);


const getCardWidth = () => {
  const slider = scrollRef.current;
  const card = slider.querySelector(".category-card");
  return card ? card.offsetWidth + 20 : 260; // gap included
};

/* ================= MANUAL SCROLL ================= */
const scrollLeft = () => {
  const slider = scrollRef.current;
  const cardWidth = getCardWidth();

  slider.scrollBy({
    left: -cardWidth,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  const slider = scrollRef.current;
  const cardWidth = getCardWidth();

  slider.scrollBy({
    left: cardWidth,
    behavior: "smooth",
  });
};

return ( <section className="category-section"> <h2 className="category-title">Shop By Category</h2>

  <div className="category-wrapper">
    <button className="cat-arrow left" onClick={scrollLeft}>
      ❮
    </button>

    <div className="category-slider" ref={scrollRef}>
     {[...categories, ...categories].map((cat, index) => (
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
