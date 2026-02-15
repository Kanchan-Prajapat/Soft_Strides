import "../styles/products.css";

const SidebarFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="sidebar">

      <h3>Filters</h3>

      {/* Category */}
      <div className="filter-group">
        <label>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option>All</option>
          <option>Dress</option>
          <option>Shirt</option>
          <option>Jeans</option>
        </select>
      </div>

      {/* Size */}
      <div className="filter-group">
        <label>Size</label>
        <select
          value={selectedSize}
          onChange={(e) =>
            setSelectedSize(e.target.value)
          }
        >
          <option>All</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>
      </div>

      {/* Color */}
      <div className="filter-group">
        <label>Color</label>
        <select
          value={selectedColor}
          onChange={(e) =>
            setSelectedColor(e.target.value)
          }
        >
          <option>All</option>
          <option>Black</option>
          <option>White</option>
          <option>Blue</option>
        </select>
      </div>

      {/* Price Slider */}
      <div className="filter-group">
        <label>Price Range</label>

        <input
          type="range"
          min="0"
          max="10000"
          step="500"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([0, Number(e.target.value)])
          }
        />

        <p>₹0 - ₹{priceRange[1]}</p>
      </div>

    </div>
  );
};

export default SidebarFilters;
