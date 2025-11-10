import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProductList from "./pages/admin/AdminProductList";
import AdminBanners from "./pages/admin/AdminBanners";

// Components
import Navbar from "./components/Navbar";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminShops from "./pages/admin/AdminShops";
import AdminShopProducts from "./pages/admin/AdminShopProducts";
import Shops from "./pages/Shops";
import EditProduct from "./pages/admin/EditProduct";


// Private Route Wrapper
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout/:shopId" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/createshops" element={<PrivateRoute><Shops /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/cart/:shopId" element={<PrivateRoute><Cart /></PrivateRoute>}/>


          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
          <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/productslist" element={<PrivateRoute><AdminProductList /></PrivateRoute>} />
          <Route path="/admin/promos" element={<PrivateRoute><AdminPromos /></PrivateRoute>} />
          <Route path="/admin/shops" element={<PrivateRoute><AdminShops /></PrivateRoute>} />
          <Route path="/admin/shopproducts/:shopId" element={<PrivateRoute><AdminShopProducts /></PrivateRoute>} />
          <Route path="/admin/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
          <Route path="/admin/banners" element={<PrivateRoute><AdminBanners /></PrivateRoute>} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
