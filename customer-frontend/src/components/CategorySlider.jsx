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

    // 🔥 smooth scaling (NO JUMP)
    const scale = Math.max(0.85, 1 - distance / 500);
    const opacity = Math.max(0.5, 1 - distance / 600);

    card.style.transform = `scale(${scale})`;
    card.style.opacity = opacity;
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


let scrollAmount = 0;

const interval = setInterval(() => {
  scrollAmount += 220;

  if (scrollAmount >= slider.scrollWidth) {
    scrollAmount = 0;
  }

  slider.scrollTo({
    left: scrollAmount,
    behavior: "smooth",
  });
}, 3000);

return () => clearInterval(interval);


}, [categories]);

/* ================= MANUAL SCROLL ================= */
const scrollLeft = () => {
scrollRef.current.scrollBy({
left: -250,
behavior: "smooth",
});
};

const scrollRight = () => {
scrollRef.current.scrollBy({
left: 250,
behavior: "smooth",
});
};

return ( <section className="category-section"> <h2 className="category-title">Shop By Category</h2>

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
