// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/config";
import {
  Box,
  Button,
  Input,
  Heading,
  FormControl,
  FormLabel,
  Stack,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/login.php`, form,{
        withCredentials: true,
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast({
          title: "Login successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        toast({
          title: response.data.message || "Login failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <Box
        w={{ base: "100%", md: "400px" }}
        p={8}
        bg="white"
        boxShadow="lg"
        borderRadius="md"
      >
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" size="lg">
            Login
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  bg="gray.50"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  bg="gray.50"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
                />
              </FormControl>

              <Button colorScheme="blue" type="submit" w="full">
                Login
              </Button>
            </Stack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.600">
            Don't have an account? <a href="/register" style={{ color: "#3182ce" }}>Register</a>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
