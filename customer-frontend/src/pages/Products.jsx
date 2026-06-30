import { useEffect, useState } from "react";
import axios from "axios";
import SidebarFilters from "../components/SidebarFilters";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";
import { useLocation } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import { fetchCategories } from "../api/categories";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/api/products/featured`, {
          params: { category: categoryId }
        });

        setProducts(res.data);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL, categoryId]);


  

  const fetchAllCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  let filteredProducts = products.filter((product) => {
    return (
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) &&

      (selectedCategory === "All" ||
        product.category?.name === selectedCategory) &&

      (selectedSize === "All" ||
        product.sizes?.includes(selectedSize)) &&

      (selectedColor === "All" ||
        product.color === selectedColor) &&

      product.discountPrice >= priceRange[0] &&
      product.discountPrice <= priceRange[1]
    );
  });


  // Sorting
  if (sort === "low") {
    filteredProducts.sort(
      (a, b) => a.discountPrice - b.discountPrice
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) => b.discountPrice - a.discountPrice
    );
  }

  if (sort === "latest") {
    filteredProducts.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }

  

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSize("All");
    setSelectedColor("All");
    setPriceRange([0, 10000]);
    setSearch("");
    setSort("");
  };

  return (
    <div className="products-page">

      {/* TOP BAR */}
      <div className="container">

        <div className="products-topbar">

          <div className="products-left">

            <input
              className="products-search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <span className="product-count">
              {filteredProducts.length} Products
            </span>

          </div>

          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="latest">Newest</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

        </div>

        <div className="active-filters">

  {selectedCategory !== "All" && (
    <button
      className="filter-chip"
      onClick={() => setSelectedCategory("All")}
    >
      {selectedCategory} ✕
    </button>
  )}

  {selectedSize !== "All" && (
    <button
      className="filter-chip"
      onClick={() => setSelectedSize("All")}
    >
      {selectedSize} ✕
    </button>
  )}

  {selectedColor !== "All" && (
    <button
      className="filter-chip"
      onClick={() => setSelectedColor("All")}
    >
      {selectedColor} ✕
    </button>
  )}

  {priceRange[1] !== 10000 && (
    <button
      className="filter-chip"
      onClick={() => setPriceRange([0, 10000])}
    >
      Under ₹{priceRange[1]} ✕
    </button>
  )}

  {search && (
    <button
      className="filter-chip"
      onClick={() => setSearch("")}
    >
      "{search}" ✕
    </button>
  )}

</div>

        {/* MOBILE FILTER */}
        <button
          className="mobile-filter-btn"
          onClick={() => setShowFilters(true)}
        >
          ☰ Filters
        </button>

        {showFilters && (
          <div
            className="filter-overlay"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* GRID */}
        <div className="products-layout">

          {/* SIDEBAR */}
          <div
            className={`sidebar-wrapper ${showFilters ? "active" : ""
              }`}
          >
            <button
              className="close-filter-btn"
              onClick={() => setShowFilters(false)}
            >
              ✕
            </button>

            <SidebarFilters
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              clearFilters={clearFilters}
            />
          </div>

          {/* PRODUCTS */}
          <div className="products-content">

            <div className="products-grid">

              {loading ? (
                <p>Loading...</p>
              ) : filteredProducts.length === 0 ? (
                <p>No products found</p>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    openCart={() => setCartOpen(true)}
                  />
                ))
              )}

            </div>

          </div>

        </div>

      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

    </div>
  );
};

export default Products;