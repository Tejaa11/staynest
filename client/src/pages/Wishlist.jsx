import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import ListingCard from '../components/ListingCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Wishlist() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .get('/auth/wishlist')
      .then(({ data }) => setListings(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <h1>My Wishlist</h1>
      <p className="muted">Your saved favourite stays.</p>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <Loader />
      ) : listings.length === 0 ? (
        <p className="muted empty">You haven't saved any stays to your wishlist yet.</p>
      ) : (
        <div className="grid">
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} onWishlistChange={load} />
          ))}
        </div>
      )}
    </section>
  );
}
