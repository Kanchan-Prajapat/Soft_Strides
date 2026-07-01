import "../styles/products.css";

const SidebarFilters = ({
  categories,
  colors,
  sizes,

  selectedCategory,
  setSelectedCategory,

  selectedSize,
  setSelectedSize,

  selectedColor,
  setSelectedColor,

  priceRange,
  setPriceRange,

  clearFilters,
}) => {
  return (
    <div className="sidebar">

      <button
        className="clear-filter-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

      <h3>Filters</h3>

      {/* CATEGORY */}
      <div className="filter-group">

        <label>Category</label>

        <div className="filter-options">

          <label className="filter-option">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "All"}
              onChange={() => setSelectedCategory("All")}
            />
            <span>All</span>
          </label>

          {categories.map((cat) => (
            <label
              key={cat._id}
              className="filter-option"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat._id}

                onChange={() =>
                  setSelectedCategory(cat._id)
                }
              />

              <span>{cat.name}</span>

            </label>
          ))}

        </div>

      </div>

      {/* SIZE */}
      <div className="filter-group">

        <label>Size</label>

        <div className="filter-options">

        {sizes.map((size) => (

<label
  key={size}
  className="filter-option"
>

<input
  type="radio"
  name="size"
  checked={selectedSize===size}
  onChange={()=>setSelectedSize(size)}
/>

<span>{size}</span>

</label>

))}

        </div>

      </div>

      {/* COLOR */}

      <div className="filter-group">

        <label>Color</label>

        <div className="filter-options">

          {colors.map((color) => (

            <label
              key={color}
              className="filter-option"
            >
              <input
                type="radio"
                name="color"
                checked={selectedColor === color}
                onChange={() =>
                  setSelectedColor(color)
                }
              />

              <span>{color}</span>

            </label>

          ))}

        </div>

      </div>

      {/* PRICE */}

      <div className="filter-group">

        <label>Price Range</label>

        <input
          type="range"
          min="0"
          max="10000"
          step="500"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([
              0,
              Number(e.target.value),
            ])
          }
        />

        <p>
          ₹0 - ₹{priceRange[1]}
        </p>

      </div>

    </div>
  );
};

export default SidebarFilters;