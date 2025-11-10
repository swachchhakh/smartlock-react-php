import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

const API_URL = "http://localhost/react-interview/backend/api/banners.php";
const BACKEND_URL = "http://localhost/react-interview/backend"; // folder where uploads are stored

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(API_URL, { withCredentials: true });
        const imgs = res.data.map(b => `${BACKEND_URL}/${b.image_url}`);
        setBanners(imgs);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };

    fetchBanners();
  }, []);

  if (!banners.length) return null;

  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      interval={5000}
      transitionTime={800}
    >
      {banners.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={img}
            alt={`Banner ${idx + 1}`}
            style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }}
            onError={(e) => { e.target.src = "https://via.placeholder.com/800x400"; }}
          />
        </motion.div>
      ))}
    </Carousel>
  );
}
