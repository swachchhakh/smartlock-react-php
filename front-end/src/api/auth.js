import axios from "axios";

const API_URL = "http://localhost/react-interview/backend/api";

export const registerUser = (user) => axios.post(`${API_URL}/users.php`, user);
export const loginUser = (user) => axios.post(`${API_URL}/login.php`, user);
