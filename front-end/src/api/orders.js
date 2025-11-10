import axios from "axios";
const API_URL = "http://localhost/react-interview/backend/api/orders.php";

export const fetchOrders = (userId, shopId) => {
  let url = `${API_URL}?`;
  if (userId) url += `user_id=${userId}&`;
  if (shopId) url += `shop_id=${shopId}`;
  return axios.get(url);
};

export const deleteOrder = (orderId) => axios.delete(API_URL, { data: { id: orderId } });
