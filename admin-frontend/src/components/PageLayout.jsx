import Sidebar from "./Sidebar";
import "./PageLayout.css";

const PageLayout = ({ title, children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <header className="page-header">
          <h1>{title}</h1>
        </header>
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
};

export default PageLayout;
