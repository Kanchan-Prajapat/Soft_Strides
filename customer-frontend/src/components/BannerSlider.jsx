import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/banner.css";


const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

useEffect(() => {
  const load = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/banners`);
      setBanners(res.data);
    } catch (err) {
      console.log("Banner API not available yet");
    }
  };
  load();
}, []);


  return (
    <div className="banner-slider">
      {banners.map((banner) => (
        <a key={banner._id} href={banner.link}>
          <img src={banner.image} alt={banner.title} />
        </a>
      ))}
    </div>
  );
};

export default BannerSlider;
