import { useEffect, useState } from "react";
import { fetchOrders, deleteOrder } from "../api/orders";

export default function Orders({ shopId }) {
  const [orders, setOrders] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user")).id;

  const loadOrders = async () => {
    const res = await fetchOrders(userId, shopId);
    setOrders(res.data);
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    loadOrders();
  };

  useEffect(() => { loadOrders(); }, []);

  return (
    <div>
      <h2>Orders</h2>
      {orders.map(o => (
        <div key={o.id}>
          <p>Order ID: {o.id}, Total: ${o.total_amount}</p>
          <p>Stripe Payment: {o.stripe_payment_id}</p>
          <button onClick={() => handleDelete(o.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
