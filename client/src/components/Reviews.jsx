import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import StarRating from './StarRating.jsx';
import { formatDate } from '../utils/format.js';

export default function Reviews({ listingId, onReviewAdded }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [editError, setEditError] = useState('');

  const load = () => api.get(`/listings/${listingId}/reviews`).then(({ data }) => setReviews(data));
  useEffect(() => {
    load();
  }, [listingId]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/listings/${listingId}/reviews`, form);
      setForm({ rating: 5, comment: '' });
      await load();
      onReviewAdded?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    setEditForm({ rating: r.rating, comment: r.comment });
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError('');
  };

  const saveEdit = async (e, reviewId) => {
    e.preventDefault();
    setEditError('');
    try {
      await api.put(`/listings/${listingId}/reviews/${reviewId}`, editForm);
      setEditingId(null);
      await load();
      onReviewAdded?.();
    } catch (err) {
      setEditError(getErrorMessage(err));
    }
  };

  const removeReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/listings/${listingId}/reviews/${reviewId}`);
      await load();
      onReviewAdded?.();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const hasReviewed = user && reviews.some((r) => (r.user?._id || r.user) === user._id);

  return (
    <section className="reviews">
      <h2>Reviews ({reviews.length})</h2>
      {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
      {reviews.map((r) => {
        const isAuthor = user && ((r.user?._id || r.user) === user._id);
        const isEditing = editingId === r._id;

        return (
          <div key={r._id} className="review">
            <div className="row-between">
              <strong>{r.user?.name || 'Guest'}</strong>
              <span className="muted small">{formatDate(r.createdAt)}</span>
            </div>

            {isEditing ? (
              <form className="form" style={{ padding: '12px 0', maxWidth: '100%' }} onSubmit={(e) => saveEdit(e, r._id)}>
                <StarRating value={editForm.rating} onChange={(rating) => setEditForm({ ...editForm, rating })} />
                <textarea
                  required
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                />
                {editError && <p className="error">{editError}</p>}
                <div className="row">
                  <button className="btn" type="submit">Save</button>
                  <button className="btn btn-ghost" type="button" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="stars-static">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p>{r.comment}</p>
                {isAuthor && (
                  <div className="row" style={{ marginTop: '8px' }}>
                    <button className="btn btn-ghost small" onClick={() => startEdit(r)}>Edit</button>
                    <button className="btn btn-danger small" onClick={() => removeReview(r._id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      {user && !hasReviewed && (
        <form className="card form" onSubmit={submit}>
          <h3>Write a review</h3>
          <StarRating value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          <textarea
            required
            placeholder="How was your stay?"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn">Submit review</button>
        </form>
      )}
    </section>
  );
}
