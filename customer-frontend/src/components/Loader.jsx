import "../styles/loader.css";

const Loader = () => {
  return (
    <div className="loader-screen">
      <div className="loader-content">

        <div className="loader-logo">
          <img
            src="/Logo.png"
            alt="Soft Strides"
            className="loader-logo-img"
          />
        </div>

        <h1>Soft Strides</h1>

        <p>Loading Premium Collection...</p>

        <div className="loader-progress">
          <span></span>
        </div>

      </div>
    </div>
  );
};

export default Loader;