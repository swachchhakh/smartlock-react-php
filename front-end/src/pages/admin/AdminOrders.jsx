import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Heading, Text, VStack, HStack, Divider, Image } from "@chakra-ui/react";

const API_URL = "http://localhost/react-interview/backend/api/orders.php";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((res) => setOrders(res.data.data));
  }, []);

  return (
    <Box p={6}>
      <Heading mb={6}>All Orders</Heading>
      <VStack spacing={4} align="stretch">
        {orders.map((order) => (
          <Box key={order.id} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">Order #{order.id}</Text>
            <Text>User ID: {order.user_id}</Text>
            <Text>Shop ID: {order.shop_id}</Text>
            <Text>Total: ${order.total_amount}</Text>
            <Text>Payment ID: {order.stripe_payment_id}</Text>
            <Text>Created At: {order.created_at}</Text>

            <Divider my={2} />
            <Text fontWeight="bold">Items:</Text>
            <VStack spacing={3} align="stretch">
              {order.items.map((item) => (
                <HStack key={item.id} spacing={4} align="center">
                  
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={`Product ${item.product_id}`}
                      boxSize="60px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  )}
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">Product ID: {item.product_id}</Text>
                    <Text>Qty: {item.quantity}</Text>
                    <Text>Price: ${item.price}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
