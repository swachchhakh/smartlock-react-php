import axios from "axios";
const API_URL = "http://localhost/react-interview/backend/api/shops.php";

export const fetchShops = () => axios.get(API_URL);
export const addShop = (formData) => axios.post(API_URL, formData);
export const updateShop = (formData) => axios.put(API_URL, formData);
export const deleteShop = (shopId) => axios.delete(`${API_URL}/shops.php`, {
    data: { id: shopId },
    withCredentials: true,
  });
  
export const fetchAllShops = async () => {
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      console.log("All shops =>", res)
      return res;

    } catch (err) {
      console.error("Error fetching shops:", err.response?.data || err.message);
      throw err;
    }
  };