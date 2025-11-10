import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProduct } from "../../api/products";
import {
  Box,
  Button,
  Input,
  Textarea,
  Heading,
  FormControl,
  FormLabel,
  Spinner,
  useToast
} from "@chakra-ui/react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo_url: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log("ID FOR EDIT=>", id)
        const data = await fetchProductById(id);
        console.log("response edit data =>", data)
        if (!data) throw new Error("Product not found");
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          photo_url: data.photo_url || ""
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Failed to load product",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, toast]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id, ...form });
      toast({
        title: "Product updated!",
        status: "success",
        duration: 2000,
        isClosable: true
      });
      navigate("/admin/productslist");
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update product",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  if (loading) return <Spinner size="xl" mt="10" display="block" mx="auto" />;

  return (
    <Box maxW="600px" mx="auto" mt="10" p="6" boxShadow="lg" borderRadius="md" bg="gray.50">
      <Heading mb="6" textAlign="center">Edit Product</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb="4" isRequired>
          <FormLabel>Name</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Description</FormLabel>
          <Textarea name="description" value={form.description} onChange={handleChange} />
        </FormControl>
        <FormControl mb="4" isRequired>
          <FormLabel>Price</FormLabel>
          <Input type="number" name="price" value={form.price} onChange={handleChange} />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Stock</FormLabel>
          <Input type="number" name="stock" value={form.stock} onChange={handleChange} />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Photo URL</FormLabel>
          <Input name="photo_url" value={form.photo_url} onChange={handleChange} />
        </FormControl>
        <Button colorScheme="blue" type="submit" w="full">Update</Button>
      </form>
    </Box>
  );
}
