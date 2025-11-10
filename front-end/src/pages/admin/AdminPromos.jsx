// src/pages/admin/AdminPromos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Heading,
  FormControl,
  FormLabel,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";

const API_BASE = "http://localhost/react-interview/backend/api";

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount_percent: "",
    expires_at: "",
  });

  const toast = useToast();

  // Load all promos from backend
  const loadPromos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/promo.php`);
      setPromos(res.data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load promos", status: "error", duration: 3000 });
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
    if (!form.code || !form.discount_percent || !form.expires_at) {
      toast({
        title: "All fields are required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  

    const formattedExpires = new Date(form.expires_at).toISOString().slice(0, 19).replace("T", " ");
    console.log("Form =>", form)
    console.log("Form ex =>", formattedExpires)
    const formData = new FormData();
formData.append("code", form.code);
formData.append("discount_percent", form.discount_percent);
formData.append("expires_at", form.expires_at);



  
    try {
      const res = await axios.post(`${API_BASE}/promo.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      if (res.data.success) {
        toast({
          title: "Promo created!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setForm({ code: "", discount_percent: "", expires_at: "" });
        loadPromos();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to create promo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/promo.php`, { data: { id } });
      toast({
        title: "Promo deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      loadPromos();
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete promo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt="10" p="6" bg="gray.50" borderRadius="md" boxShadow="lg">
      <Heading mb="6" textAlign="center">Manage Promo Codes</Heading>

      {/* Form to create promo */}
      <Box mb="8">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Promo Code</FormLabel>
              <Input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Enter promo code"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Discount %</FormLabel>
              <Input
                name="discount_percent"
                type="number"
                min="1"
                max="100"
                value={form.discount_percent}
                onChange={handleChange}
                placeholder="Discount percentage"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Expires At</FormLabel>
              <Input
                name="expires_at"
                type="datetime-local"
                value={form.expires_at}
                onChange={handleChange}
              />
            </FormControl>

            <Button colorScheme="blue" type="submit" w="full">
              Create Promo
            </Button>
          </Stack>
        </form>
      </Box>

      {/* Table of promos */}
      <Box overflowX="auto">
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Code</Th>
              <Th>Discount %</Th>
              <Th>Expires At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {promos.map((promo) => (
              <Tr key={promo.id}>
                <Td>{promo.id}</Td>
                <Td>{promo.code}</Td>
                <Td>{promo.discount_percent}</Td>
                <Td>{new Date(promo.expires_at).toLocaleString()}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(promo.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
