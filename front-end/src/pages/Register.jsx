import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Link,
  useToast
} from "@chakra-ui/react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await registerUser(form);
      console.log("Register response =>", response);
  
      if (response.data?.success) {
        toast({
          title: "Registration successful!",
          description: response.data.message,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
  
        navigate("/home");
      } else {
        setError(response.data?.message || "Registration failed");
      }
    } catch (err) {
      console.log("Register error =>", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="10"
      p="8"
      borderRadius="lg"
      bg="white"
      boxShadow="lg"
    >
      <Heading mb="6" textAlign="center" color="teal.600">
        Create Account
      </Heading>

      {error && (
        <Alert status="error" mb="4" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              focusBorderColor="teal.400"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              focusBorderColor="teal.400"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              focusBorderColor="teal.400"
            />
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            width="full"
            isLoading={loading}
            loadingText="Registering"
          >
            Sign Up
          </Button>
        </VStack>
      </form>

      <Text mt="4" textAlign="center" color="gray.600">
        Already have an account?{" "}
        <Link href="/login" color="teal.500" fontWeight="medium">
          Login here
        </Link>
      </Text>
    </Box>
  );
}
