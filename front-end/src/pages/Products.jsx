import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../api/products";
import { addToCart } from "../api/cart";
const BACKEND_URL = "http://localhost/react-interview/backend";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


export default function Products() {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProducts(shopId)
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [shopId]);

  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login first!");
  
    const cartItem = {
      user_id: user.id,        // user ID
      product_id: product.id,  // product ID
      shop_id: product.shop_id, // get shop from product
      quantity: 1,
    };
  
    try {
      const res = await addToCart(cartItem);
      console.log(res);
     
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };
  

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    deleteProduct(id)
      .then(() => setProducts(products.filter(p => p.id !== id)))
      .catch(err => alert(err.message));
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Products</h2>
      {user && user.role === "admin" && (
        <Link to={`/shops/${shopId}/products/new`} className="btn btn-primary">
          Add Product
        </Link>
      )}
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <Carousel showThumbs={false} infiniteLoop autoPlay>
              <div>
              <img
  src={`${BACKEND_URL}/${product.photo_url}`}
  alt={product.name}
  style={{ width: "100%", objectFit: "cover", borderRadius: "8px" }}
/>
              </div>
            </Carousel>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button onClick={() => handleAddToCart(product)} style={styles.btn}>
              Add to Cart
            </button>
            {user?.role === "admin" && (
              <>
                <button onClick={() => handleDelete(product.id)} style={styles.deleteBtn}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1rem",
    marginTop: "1rem"
  },
  card: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    textAlign: "center"
  },
  btn: {
    padding: "0.25rem 0.5rem",
    margin: "0.25rem",
    cursor: "pointer"
  },
  deleteBtn: {
    padding: "0.25rem 0.5rem",
    margin: "0.25rem",
    cursor: "pointer",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: "4px"
  }
};
