import axios from "axios";
const API_URL = "http://localhost/react-interview/backend/api/products.php";
export const addProduct = (formData) =>
    axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
export async function fetchAllProducts() {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
export async function fetchProducts(shopId) {
  const res = await fetch(`${API_URL}?shop_id=${shopId}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
export async function fetchProductById(id) {
  const res = await fetch(`${API_URL}?id=${id}`);
  console.log("API RESPONSE fetchProductById =>", res);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
export async function createProduct(formData) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  return res.json();
}
export async function updateProduct(productData) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(productData),
  });
  return res.json();
}
export async function deleteProduct(id) {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
