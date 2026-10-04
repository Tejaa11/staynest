import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import ListingCard from '../components/ListingCard.jsx';
import Loader from '../components/Loader.jsx';
import { STAY_TYPES } from '../utils/format.js';

const initial = { city: '', type: '', guests: '', maxPrice: '' };

export default function Home() {
  const [filters, setFilters] = useState(initial);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const search = (currentFilters, pageNum = 1, currentSort = sort) => {
    setLoading(true);
    setError('');
    const clean = Object.fromEntries(Object.entries(currentFilters).filter(([, v]) => v !== ''));
    api
      .get('/listings', { params: { ...clean, page: pageNum, sort: currentSort } })
      .then(({ data }) => {
        setListings(data.listings || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search(initial, 1, 'newest');
  }, []);

  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setPage(1);
    search(filters, 1, sort);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    search(filters, 1, newSort);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    search(filters, newPage, sort);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <div className="hero">
        <h1>Find your next nest.</h1>
        <p className="muted">Homestays, havelis, villas and hostels across India.</p>
        <form className="search-bar card" onSubmit={submit}>
          <input placeholder="Where to? (e.g. Jaipur)" value={filters.city} onChange={set('city')} />
          <select value={filters.type} onChange={set('type')}>
            <option value="">Any type</option>
            {STAY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" min="1" placeholder="Guests" value={filters.guests} onChange={set('guests')} />
          <input type="number" min="0" placeholder="Max ₹/night" value={filters.maxPrice} onChange={set('maxPrice')} />
          <button className="btn">Search</button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="row-between" style={{ margin: '20px 0 16px' }}>
        <span className="muted">{total} stay{total !== 1 ? 's' : ''} available</span>
        <div className="row">
          <label style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            Sort by:
            <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : listings.length === 0 ? (
        <p className="muted">No stays match your search.</p>
      ) : (
        <>
          <div className="grid">
            {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
          </div>

          {totalPages > 1 && (
            <div className="row" style={{ justifyContent: 'center', marginTop: '36px', gap: '12px' }}>
              <button
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
              <span style={{ alignSelf: 'center', fontSize: '0.95rem' }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-ghost"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
