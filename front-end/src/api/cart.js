import axios from "axios";
const API_URL = "http://localhost/react-interview/backend/api/cart.php";

// fetch all cart items for user
export const fetchCart = (userId) => axios.get(`${API_URL}?user_id=${userId}`);

// add product to cart
export const addToCart = (item) => axios.post(API_URL, item);

// update quantity
export const updateCartItem = (item) => axios.put(API_URL, item);

// remove a cart item
export const removeCartItem = (id) => axios.delete(API_URL, { data: { id } });

// clear all cart items (optional, if you implement)
export const clearCart = (userId, shopId) => axios.post(`${API_URL}?action=clear`, { user_id: userId, shop_id: shopId });
