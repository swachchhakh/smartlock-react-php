import { useState, useEffect } from "react";
import { createProduct } from "../../api/products";
import { fetchAllShops } from "../../api/shop";
import {
  Box,
  Button,
  Input,
  Textarea,
  Heading,
  FormControl,
  FormLabel,
  Stack,
  useToast,
  Select,
  Spinner,
  Image,
} from "@chakra-ui/react";

export default function AdminProducts() {
  const [form, setForm] = useState({
    shop_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: null,
  });

  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [preview, setPreview] = useState(null);

  const toast = useToast();

  useEffect(() => {
    // Fetch shops for dropdown
    const loadShops = async () => {
      try {
        const res = await fetchAllShops();
        setShops(res.data || []);
      } catch (err) {
        toast({
          title: "Failed to fetch shops",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingShops(false);
      }
    };

    loadShops();
  }, [toast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, photo: file });
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.shop_id) {
      toast({
        title: "Please select a shop",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!form.photo) {
      toast({
        title: "Please select a product photo",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const res = await createProduct(formData);
      console.log("Response", res);

      toast({
        title: "Product created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setForm({
        shop_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: null,
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to create product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt="10"
      p="6"
      boxShadow="xl"
      borderRadius="lg"
      bg="gray.50"
    >
      <Heading mb="6" textAlign="center" color="blue.600">
        Create Product
      </Heading>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Select Shop</FormLabel>
            {loadingShops ? (
              <Spinner />
            ) : (
              <Select
                name="shop_id"
                placeholder="Select a shop"
                value={form.shop_id}
                onChange={handleChange}
                bg="white"
              >
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Product Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              bg="white"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product Description"
              bg="white"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              bg="white"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Stock</FormLabel>
            <Input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock Quantity"
              bg="white"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Product Photo</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <Box mt={3} textAlign="center">
                <Image
                  src={preview}
                  alt="Preview"
                  borderRadius="md"
                  maxH="200px"
                  mx="auto"
                  objectFit="cover"
                />
              </Box>
            )}
          </FormControl>

          <Button colorScheme="blue" type="submit" w="full">
            Create Product
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
