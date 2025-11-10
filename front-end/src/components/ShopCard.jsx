
import axios from "axios";

export default function ShopCard({ shop, refresh }) {
  const handleDelete = async () => {
    await axios.delete(`http://localhost/backend/api/shops.php?id=${shop.id}`);
    refresh();
  };

  return (
    <div>
      <h3>{shop.name}</h3>
      {shop.photo_url && <img src={`http://localhost/backend/${shop.photo_url}`} width={200} />}
      <p>{shop.description}</p>
      <p>{shop.address}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
