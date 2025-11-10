// src/pages/admin/AdminProductList.jsx
import { useEffect, useState } from "react";
import { fetchAllProducts, deleteProduct } from "../../api/products";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  StackDivider,
  useToast,
} from "@chakra-ui/react";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const response = await fetchAllProducts();
    console.log("DATA =>", response)
    setProducts(response);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Product deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadProducts();
    } catch (err) {
      toast({
        title: "Failed to delete product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);

  return (
    <Box maxW="900px" mx="auto" mt={10} p={6}>
      <Heading mb={6} textAlign="center">
        All Products
      </Heading>

      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        {products.length === 0 && (
          <Text textAlign="center" color="gray.500">
            No products found.
          </Text>
        )}

        {products.map((p) => (
          <HStack
            key={p.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            justifyContent="space-between"
            bg="gray.50"
            _hover={{ bg: "gray.100" }}
          >
            <Box>
              <Text fontWeight="bold">{p.name}</Text>
              <Text color="gray.600">
                ${p.price} - Stock: {p.stock}
              </Text>
              {p.description && (
                <Text fontSize="sm" color="gray.500">
                  {p.description}
                </Text>
              )}
            </Box>
            <HStack spacing={2}>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => handleEdit(p.id)}
              >
                Edit
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </Button>
            </HStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default AdminProductList;
