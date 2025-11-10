// src/pages/AdminShopProducts.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Image,
  Heading,
  Text,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";

export default function AdminShopProducts() {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`http://localhost/react-interview/backend/api/shops.php?id=${shopId}`)
      .then((res) => setShop(res.data))
      .catch(() =>
        toast({
          title: "Error loading shop details",
          status: "error",
          duration: 3000,
        })
      );

    axios
      .get(`http://localhost/react-interview/backend/api/products.php?shop_id=${shopId}`)
      .then((res) => setProducts(res.data))
      .catch(() =>
        toast({
          title: "Error loading products",
          status: "error",
          duration: 3000,
        })
      );
  }, [shopId]);

  if (!shop) return <Text>Loading shop details...</Text>;
  const handleDelete = async (productId) => {
    console.log("You clicked, ", productId)
    try {
      const res = await axios.delete(`http://localhost/react-interview/backend/api/products.php`, {
        data: { id: productId },
        withCredentials: true,
      });
      console.log(res);
      setProducts(products.filter((p) => p.id !== productId));
      toast({
        title: "Product deleted",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete product",
        status: "error",
        duration: 3000,
      });
    }
  };
  
  

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Heading mb={6}>{shop.name} - Products</Heading>

      {products.length === 0 ? (
        <Text>No products available for this shop.</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
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
                src={p.photo_url || "https://via.placeholder.com/150"}
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
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(p.id)}>
  Delete
</Button>

              </VStack>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
}
