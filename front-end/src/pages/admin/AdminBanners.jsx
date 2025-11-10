import { useState, useEffect } from "react";
import { Box, Button, Heading, Input, VStack, Image, SimpleGrid, useToast } from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "http://localhost/react-interview/backend/api/banners.php";

export default function AdminBanners() {
  const [banners, setBanners] = useState([null, null, null]);
  const toast = useToast();
  const [files, setFiles] = useState([null, null, null]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(API_URL, { withCredentials: true });
        const imgs = [null, null, null];
        res.data.forEach(b => { if (b.id >=1 && b.id <=3) imgs[b.id-1] = b.image_url });
        setBanners(imgs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanners();
  }, []);

  const handleFileChange = (index, e) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file, index) => {
      if (file) formData.append(`banner${index+1}`, file);
    });

    try {
      const res = await axios.post(API_URL, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Banners updated!", status: "success", duration: 3000, isClosable: true });
      setBanners(Object.values(res.data.uploaded));
    } catch (err) {
      toast({ title: "Failed to upload", status: "error", duration: 3000, isClosable: true });
      console.error(err);
    }
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Heading textAlign="center" mb={6}>Manage Banners</Heading>
      <VStack spacing={6} maxW="600px" mx="auto">
        <SimpleGrid columns={3} gap={4}>
          {banners.map((banner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <Box border="1px solid #ccc" p={2} borderRadius="md" bg="white" textAlign="center">
                {banner ? <Image src={`http://localhost/react-interview/backend/api/${banner}`} alt={`Banner ${idx+1}`} borderRadius="md" /> : <Box h="100px" bg="gray.100" borderRadius="md" />}
                <Input mt={2} type="file" onChange={(e) => handleFileChange(idx, e)} />
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
        <Button colorScheme="blue" w="full" onClick={handleUpload}>Save Banners</Button>
      </VStack>
    </Box>
  );
}
