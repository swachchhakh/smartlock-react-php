import axios from "axios";
const API_URL = "http://localhost/react-interview/backend/api/promo.php";

export const fetchPromoCodes = () => axios.get(API_URL);
export const addPromoCode = (promo) => axios.post(API_URL, promo);
export const deletePromoCode = (id) => axios.delete(API_URL, { data: { id } });
