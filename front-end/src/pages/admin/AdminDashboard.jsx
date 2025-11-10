import { Box, Heading, SimpleGrid, Button, VStack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionBox = motion(Box);

const dashboardLinks = [
  { label: "Create Products", path: "/admin/products", color: "blue" },
  { label: "Create Shops", path: "/admin/shops", color: "teal" },
  { label: "View Orders", path: "/admin/orders", color: "purple" },
  { label: "View Users", path: "/admin/users", color: "orange" },
  { label: "Products List", path: "/admin/productslist", color: "pink" },
  { label: "Manage Promos", path: "/admin/promos", color: "green" },
  { label: "Banners", path: "/admin/banners", color: "green" },
];

export default function AdminDashboard() {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, white)" py={16} px={8}>
      <VStack spacing={8}>
        <Heading
          as={motion.h1}
          size="xl"
          fontWeight="bold"
          textAlign="center"
          color="blue.700"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        Admin Dashboard
        </Heading>

        <Text
          as={motion.p}
          fontSize="lg"
          color="gray.600"
          textAlign="center"
          maxW="500px"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Manage everything in one place — products, shops, users, and more.
        </Text>

        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={8}
          w="full"
          maxW="1000px"
          mt={4}
        >
          {dashboardLinks.map((link, index) => (
            <MotionBox
              key={link.path}
              bg="white"
              borderRadius="2xl"
              boxShadow="md"
              p={6}
              textAlign="center"
              whileHover={{ y: -5, scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <VStack spacing={3}>
                <Heading size="md" color={`${link.color}.600`}>
                  {link.label}
                </Heading>
                <Button
                  as={Link}
                  to={link.path}
                  colorScheme={link.color}
                  variant="solid"
                  size="md"
                  _hover={{ transform: "scale(1.05)" }}
                >
                  Go to {link.label}
                </Button>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
