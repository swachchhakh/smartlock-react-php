import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Image,
  Spinner,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { fetchCart } from "../api/cart";

const stripePromise = loadStripe("pk_test_51SQgrDE2yJfs3AXVIMzqIq0FxpvZ6IeWuA85mCmVBt2RItu8CPFPDRk5xZEJyWsRfScP6vkgHOqZs59qVtzb34RM00bdJ6cpUj");
const API_URL = "http://localhost/react-interview/backend/api";

function CheckoutForm({ shopId, items }) {
  const stripe = useStripe();
  const elements = useElements();
  const user = JSON.parse(localStorage.getItem("user"));
  const toast = useToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
  
    try {
      // 1. Create payment intent
      const res = await axios.post(`${API_URL}/checkout.php`, {
        user_id: user.id,
        shop_id: shopId,
        total_amount: total,
        email: user.email,
        items,
      });
  
      const clientSecret = res.data.client_secret;
  
      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
  
      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setProcessing(false);
      } else {
        // Payment successful, save order
        await axios.post(`${API_URL}/orders.php`, {
          user_id: user.id,
          shop_id: shopId,
          total_amount: total,               // use `total` from above
          stripe_payment_id: result.paymentIntent.id, // use `result.paymentIntent.id`
          items,                             // `items` already passed as prop
        });
  
        // Clear cart
        await axios.post(`${API_URL}/cart.php?action=clear`, {
          user_id: user.id,
          shop_id: shopId,
        });
  
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
  
        setProcessing(false);
        navigate("/cart");
      }
    } catch (err) {
      console.error("Checkout Error =>", err);
      toast({
        title: "Error",
        description: "Something went wrong during checkout.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setProcessing(false);
    }
  };
  

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      width="100%"
      maxW="500px"
      mx="auto"
    >
      <Heading size="md" mb={4}>
        Payment Details
      </Heading>

      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={3}
        mb={4}
      >
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </Box>


      <Button
        colorScheme="blue"
        width="100%"
        mt={3}
        type="submit"
        onClick={handleSubmit}
        isDisabled={!stripe}
      >
        Pay ${total.toFixed(2)}
      </Button>
      {processing ? (
          <Spinner size="xl" color="teal.400" />
        ) : null}
        Pay ${total.toFixed(2)}
    </Box>
  );
}

export default function Checkout() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    fetchCart(user.id)
      .then((res) => {
        const shopItems = res.data.filter(
          (i) => i.shop_id === parseInt(shopId)
        );
        setItems(shopItems);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [shopId]);

  if (!user)
    return (
      <Box textAlign="center" mt={20}>
        <Text>Please login to proceed to checkout.</Text>
      </Box>
    );

  if (loading)
    return (
      <Flex align="center" justify="center" h="80vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (!items.length)
    return (
      <Box textAlign="center" mt={20}>
        <Text>No items found for checkout.</Text>
      </Box>
    );

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Box bg="gray.50" minH="100vh" p={6}>
      <Heading mb={6} textAlign="center">
        Checkout
      </Heading>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        justify="center"
        align="flex-start"
      >
        {/* Order Summary */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="md"
          flex="1"
          maxW="500px"
        >
          <Heading size="md" mb={4}>
            Order Summary
          </Heading>
          <VStack align="stretch" spacing={4}>
            {items.map((item) => (
              <HStack
                key={item.id}
                justify="space-between"
                borderBottom="1px solid #eee"
                pb={2}
              >
                <HStack spacing={3}>
                  <Image
                    src={`http://localhost/react-interview/backend/${item.photo_url}`}
                    alt={item.name}
                    boxSize="60px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                  <Box>
                    <Text fontWeight="medium">{item.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Qty: {item.quantity}
                    </Text>
                  </Box>
                </HStack>
                <Text fontWeight="bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Divider my={4} />
          <Text fontSize="lg" fontWeight="bold" textAlign="right">
            Total: ${totalAmount.toFixed(2)}
          </Text>
        </Box>

        {/* Payment Form */}
        <Elements stripe={stripePromise}>
          <CheckoutForm shopId={shopId} items={items} />
        </Elements>
      </Flex>
    </Box>
  );
}




