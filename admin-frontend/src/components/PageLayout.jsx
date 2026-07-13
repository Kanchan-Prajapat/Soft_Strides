import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "./PageLayout.css";

const PageLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-shell">

      <div className="admin-topbar">
        <FaBars
          className="hamburger"
          onClick={() => setIsOpen(true)}
        />
        <h3>Admin Panel</h3>
      </div>

      <div className="admin-layout">

        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <main className="app-main">
          {children}
        </main>

      </div>

    </div>
  );
};

export default PageLayout;