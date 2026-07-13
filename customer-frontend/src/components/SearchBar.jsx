import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../styles/searchBar.css"

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
const [loading, setLoading] = useState(false);
const [showDropdown, setShowDropdown] = useState(false);

const searchRef = useRef(null);

const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  useEffect(() => {
  if (query.trim().length < 2) {
    setSuggestions([]);
    setShowDropdown(false);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/products/search?q=${query}`
      );

      setSuggestions(res.data);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, 300);

  return () => clearTimeout(timer);

}, [query, API_URL]);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${query}`);
    }
  };

  return (
 <div className="search-wrapper" ref={searchRef}>
  <form className="search-bar" onSubmit={handleSearch}>
  <input
    className="search-bar-input"
    type="text"
    placeholder="Search oversized tees..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <button type="submit" className="search-btn">
 <FontAwesomeIcon
  icon={faMagnifyingGlass}
  style={{ color: "#000", width:"18px", height:"18px" }}
/>
  </button>
</form>
{showDropdown && (
  <div className="search-dropdown">

    {loading ? (
      <div className="search-loading">
        Searching...
      </div>
    ) : suggestions.length > 0 ? (

      <>
        {suggestions.map((product) => (

          <div
            key={product._id}
            className="search-item" 
            onClick={() => {
              navigate(`/product/${product._id}`);
              setShowDropdown(false);
              setQuery("");
            }}
          >

            <img
              src={product.images[0]}
              alt={product.name}
            />

            <div className="search-item-info">

              <h4>{product.name}</h4>

              <p>{product.category?.name}</p>

            </div>

          </div>

        ))}

        <button
          className="view-all-btn"
          onClick={() => {
            navigate(`/products?search=${query}`);
            setShowDropdown(false);
          }}
        >
          View all results →
        </button>

      </>

    ) : (

      <div className="search-empty">
        😕 No products found
      </div>

    )}

  </div>
)}
</div>


  );
};

export default SearchBar;
