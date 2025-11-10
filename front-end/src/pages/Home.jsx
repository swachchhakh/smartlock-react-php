// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { addToCart as addToCartAPI } from "../api/cart";
import axios from "axios";
import {
  Box,
  Grid,
  Image,
  Heading,
  Text,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { PHOTO_BUCKET, API_BASE } from "../api/config";
import BannerCarousel from "../components/BannerCarousel";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Fetch logged-in user
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);

    // Fetch products
    axios
      .get(`${API_BASE}/products.php`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addToCart = async (product) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add products to your cart.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addToCartAPI({
        user_id: user.id,
        shop_id: product.shop_id,
        product_id: product.id,
        quantity: 1,
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Add to cart error:", err);
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (

    <Box p={6} bg="gray.50" minH="100vh">
     
      <BannerCarousel />
      <Heading m={6} textAlign="center">
        All Products
      </Heading>
      {products.length > 0 ? (
        <Grid templateColumns="repeat(5, 1fr)"  gap={6}>
          {products.map((p) => (
            <Box
              key={p.id}
              bg="white"
              borderRadius="md"
              boxShadow="md"
              p={4}
              textAlign="center"
              _hover={{ boxShadow: "xl" }}
            >
              <Image
                src={
                  p.photo_url
                    ? `${PHOTO_BUCKET}/${p?.photo_url}`
                    : "https://via.placeholder.com/150"
                }
                alt={p.name}
                borderRadius="md"
                objectFit="cover"
                h="150px"
                w="100%"
                mb={4}
              />
              <VStack spacing={2}>
                <Text fontWeight="bold">{p.name}</Text>
                <Text color="gray.600">${p.price}</Text>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => addToCart(p)}
                  isDisabled={user?.role === "admin"}
                >
                  {user?.role === "admin" ? "Not Applicable" : "Add to Cart"}
                </Button>
              </VStack>
            </Box>
          ))}
        </Grid>
      ) : (
        <Text textAlign="center" mt={10}>
          No products available.
        </Text>
      )}
    </Box>
  );
}
