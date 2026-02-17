import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${query}`);
    }
  };

  return (
  <form className="search-bar" onSubmit={handleSearch}>
  <input
    className="search-bar-input"
    type="text"
    placeholder="Search shoes..."
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

  );
};

export default SearchBar;
