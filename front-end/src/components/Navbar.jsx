// src/components/Navbar.jsx
import { Box, HStack, Button, Link, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/config";
export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // get logged-in user
  
  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE}/auth.php?action=logout`, { withCredentials: true });
      localStorage.removeItem("user"); // clear frontend user info
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Box bg="blue.500" color="white" px={6} py={4}>
      <HStack spacing={6}>
  

        {!user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            {user.role === "admin" && (
              <>
                <Link href="/admin">Admin Dashboard</Link>
               
              </>
            )}
            <Link href="/home">Home</Link>
            {user.role === "user" && <Link href="/cart">Cart</Link>}
            <Spacer />
            <Button size="sm" colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </HStack>
    </Box>
  );
}
