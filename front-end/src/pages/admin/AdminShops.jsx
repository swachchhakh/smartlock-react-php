// src/pages/admin/AdminShops.jsx
import { useEffect, useState } from "react";
import {
  useToast,
  Box,
  Grid,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { fetchAllShops, deleteShop } from "../../api/shop";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllShops()
      .then((res) => {
        setShops(res?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;

    try {
      const deleteShopRes = await deleteShop(id);

      if (deleteShopRes?.data?.success) {
        toast({
          title: "Shop deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setShops((prev) => prev.filter((shop) => shop.id !== id));
      } else {
        toast({
          title: deleteShopRes?.data?.error || "Failed to delete shop",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Failed to delete shop",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minH="80vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Box p={8} bgGradient="linear(to-br, gray.50, blue.50)" minH="100vh">
      <VStack spacing={6}>
        <Heading
          fontSize="3xl"
          textAlign="center"
          color="blue.700"
          letterSpacing="wide"
        >
        Admin Shops Dashboard
        </Heading>

        <Button
          colorScheme="blue"
          size="md"
          onClick={() => navigate(`/createshops`)}
          rounded="full"
          px={8}
          boxShadow="md"
          _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
          transition="all 0.2s ease"
        >
          + Create New Shop
        </Button>

        {shops.length > 0 ? (
          <Grid
            w="full"
            templateColumns="repeat(auto-fit, minmax(280px, 1fr))"
            gap={6}
            mt={6}
          >
            {shops.map((shop, i) => (
              <MotionBox
                key={shop.id}
                bg="white"
                borderRadius="2xl"
                boxShadow="md"
                overflow="hidden"
                p={4}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
                }}
              >
                <VStack spacing={3} align="start">
                  {shop.photo && (
                    <Image
                      src={shop.photo}
                      alt={shop.name}
                      borderRadius="xl"
                      objectFit="cover"
                      h="150px"
                      w="full"
                    />
                  )}
                  <Box w="full">
                    <Text fontWeight="bold" fontSize="xl" color="blue.600">
                      {shop.name}
                    </Text>
                    <Text color="gray.600" fontSize="sm" mt={1}>
                      {shop.description || "No description available."}
                    </Text>
                  </Box>

                  <HStack w="full" spacing={3} mt={3}>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      flex={1}
                      onClick={() =>
                        navigate(`/admin/shopproducts/${shop.id}`)
                      }
                      _hover={{ bg: "blue.50" }}
                    >
                      View Products
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="solid"
                      size="sm"
                      flex={1}
                      onClick={() => handleDelete(shop.id)}
                      _hover={{ transform: "scale(1.05)" }}
                    >
                      Delete
                    </Button>
                  </HStack>
                </VStack>
              </MotionBox>
            ))}
          </Grid>
        ) : (
          <Text textAlign="center" mt={10} fontSize="lg" color="gray.600">
            No shops available.
          </Text>
        )}
      </VStack>
    </Box>
  );
}
