import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Input,
  VStack,
  HStack,
  Divider,
  useToast,
  Stack,
} from "@chakra-ui/react";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../api/cart";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const toast = useToast();

  useEffect(() => {
    if (!user) return;
    reloadCart();
  }, [user]);

  const reloadCart = () => {
    fetchCart(user.id)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error(err));
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    await updateCartItem({ id, quantity });
    reloadCart();
  };

  const handleRemove = async (id) => {
    const res = await removeCartItem(id);
    console.log("handleRemove =>", res)
    reloadCart();
  };

  const handleClearShopCart = async (shopId) => {
    const res = await clearCart(user.id, shopId);
    console.log("handleClearShopCart =>", res)
    reloadCart();
  };

  if (!user)
    return (
      <Box textAlign="center" mt={20}>
        <Text fontSize="xl">Please login to see your cart.</Text>
      </Box>
    );

  if (cartItems.length === 0)
    return (
      <Box textAlign="center" mt={20}>
        <Heading size="lg" mb={4}>
          My Cart
        </Heading>
        <Text color="gray.600">Your cart is empty.</Text>
      </Box>
    );

  // Group by shop
  const groupedByShop = cartItems.reduce((acc, item) => {
    if (!acc[item.shop_id])
      acc[item.shop_id] = { shopName: item.shop_name, items: [] };
    acc[item.shop_id].items.push(item);
    return acc;
  }, {});

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Heading mb={8} textAlign="center">
        My Cart
      </Heading>

      <VStack spacing={8} align="stretch">
        {Object.entries(groupedByShop).map(([shopId, shopData]) => {
          const totalAmount = shopData.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return (
            <Box
              key={shopId}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              p={6}
              _hover={{ boxShadow: "xl" }}
            >
              <HStack justify="space-between" mb={4}>
                <Heading size="md">{shopData.shopName}</Heading>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleClearShopCart(shopId)}
                >
                  Clear Cart
                </Button>
              </HStack>

              <Table variant="simple">
                <Thead bg="gray.100">
                  <Tr>
                    <Th>Product</Th>
                    <Th>Photo</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th isNumeric>Total</Th>
                    <Th textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {shopData.items.map((item) => (
                    <Tr key={item.id}>
                      <Td fontWeight="medium">{item.name}</Td>
                      <Td>
                        <Image
                          src={`http://localhost/react-interview/backend/${item.photo_url}`}
                          alt={item.name}
                          boxSize="60px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </Td>
                      <Td isNumeric>${item.price}</Td>
                      <Td isNumeric>
                        <Input
                          type="number"
                          value={item.quantity}
                          min={1}
                          width="70px"
                          textAlign="center"
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </Td>
                      <Td isNumeric>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Td>
                      <Td textAlign="center">
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Divider my={4} />
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Total: ${totalAmount.toFixed(2)}
                </Text>
                <Stack direction="row" spacing={4}>
                  <Button
                    colorScheme="blue"
                    onClick={() => navigate(`/checkout/${shopId}`)}
                  >
                    Proceed to Checkout
                  </Button>
                </Stack>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

export default Cart;
