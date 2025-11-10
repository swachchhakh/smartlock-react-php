import { useEffect, useState } from "react";
import axios from "axios";
import ShopCard from "../components/ShopCard";
import { fetchAllShops } from "../api/shop";
import AutocompleteCustom from "../components/PlacesAutocomplete";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Heading,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Text,
  useToast,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionImage = motion(Image);
const API_URL = "http://localhost/react-interview/backend/api";

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // const loadAllShops = async() =>{
  //   res = await fetchAllShops();
   
  //   setShops(res?.data)
  // }



  const handleAddShop = async () => {
    if (!name || !photo) {
      toast({
        title: "Please enter name and select a photo.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("address", address?.label || "");
    formData.append("photo", photo);
    formData.append("created_by", JSON.parse(localStorage.getItem("user")).id);

    try {
      const res = await axios.post(`${API_URL}/shops.php`, formData, {
        withCredentials: true,
      });
      console.log("shop =>", res);
      toast({
        title: "Shop added successfully!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setName("");
      setDescription("");
      setAddress(null);
      setPhoto(null);
      setPreview(null); 
      navigate(-1); 
    } catch (err) {
      toast({
        title: "Error adding shop",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle image preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    } else {
      setPreview(null);
    }
  };



  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch" maxW="600px" mx="auto">
        <Heading textAlign="center">Manage Shops</Heading>

        <Box bg="white" p={6} borderRadius="md" boxShadow="md">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Shop Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter shop name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <AutocompleteCustom onSelect={(place) => setAddress(place)} />
            </FormControl>

            <FormControl>
              <FormLabel>Photo</FormLabel>
              <Input type="file" accept="image/*" onChange={handlePhotoChange} />

              {preview && (
                <MotionImage
                  src={preview}
                  alt="Preview"
                  borderRadius="md"
                  mt={3}
                  boxShadow="sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </FormControl>

            <Button colorScheme="blue" onClick={handleAddShop} w="full">
              Add Shop
            </Button>
          </VStack>
        </Box>

      

      
      </VStack>
    </Box>
  );
}
