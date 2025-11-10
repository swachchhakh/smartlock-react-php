// src/api/users.js
import axios from "axios";

const API_URL = "http://localhost/react-interview/backend/api/users.php"; // adjust if needed

// Fetch all users (for admin dashboard)
export const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};
