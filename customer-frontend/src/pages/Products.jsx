import { useEffect, useState } from "react";
import axios from "axios";
import SidebarFilters from "../components/SidebarFilters";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";
import { useLocation } from "react-router-dom";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const categoryId = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
  `${API_URL}/api/products`,
  {
    params: { category: categoryId }
  }
);

        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // ✅ Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" ||
      product.category?.name === selectedCategory;

    const matchSize =
      selectedSize === "All" ||
      product.sizes?.includes(selectedSize);

    const matchColor =
      selectedColor === "All" ||
      product.color === selectedColor;

    const matchPrice =
      product.price >= priceRange[0] &&
      product.price <= priceRange[1];

    return (
      matchCategory &&
      matchSize &&
      matchColor &&
      matchPrice
    );
  });

  return (
    <div className="products-page">
      <div className="container products-layout">

        {/* Sidebar */}
        <SidebarFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {/* Product Grid */}
        <div className="products-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;