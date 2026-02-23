import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "./PageLayout.css";

const PageLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-shell">

      {/* Topbar for mobile */}
      <div className="admin-topbar">
        <FaBars
          className="hamburger"
          onClick={() => setIsOpen(true)}
        />
        <h3>Admin Panel</h3>
      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="app-main">
        {children}
      </main>

    </div>
  );
};

export default PageLayout;