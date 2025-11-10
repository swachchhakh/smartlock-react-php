import { useEffect, useState } from "react";
import { fetchReviews, addReview } from "../api/reviews";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const userId = JSON.parse(localStorage.getItem("user")).id;

  const loadReviews = async () => {
    const res = await fetchReviews(productId);
    setReviews(res.data);
  };

  const handleAddReview = async () => {
    await addReview({ product_id: productId, user_id: userId, rating, comment });
    setComment("");
    setRating(5);
    loadReviews();
  };

  useEffect(() => { loadReviews(); }, [productId]);

  return (
    <div>
      <h3>Reviews</h3>
      <input type="number" min={1} max={5} value={rating} onChange={e => setRating(e.target.value)} />
      <input placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)} />
      <button onClick={handleAddReview}>Add Review</button>
      <ul>
        {reviews.map(r => <li key={r.id}>{r.user_name}: {r.rating} ⭐ - {r.comment}</li>)}
      </ul>
    </div>
  );
}
