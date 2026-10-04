import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR } from '../utils/format.js';

export default function ListingCard({ listing, onWishlistChange }) {
  const { user, isWishlisted, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const wishlisted = isWishlisted?.(listing._id);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleWishlist(listing._id);
    onWishlistChange?.();
  };

  return (
    <Link to={`/stays/${listing._id}`} className="card listing-card" style={{ position: 'relative' }}>
      <button
        type="button"
        className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
        onClick={handleHeartClick}
        title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '18px',
          color: wishlisted ? '#e53e3e' : '#a0aec0',
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        }}
      >
        ♥
      </button>
      <img src={listing.images[0]} alt={listing.title} />
      <div className="card-body">
        <div className="row-between">
          <span className="tag">{listing.type}</span>
          <span className="muted">
            {listing.reviewCount > 0 ? `★ ${listing.avgRating} (${listing.reviewCount})` : 'New'}
          </span>
        </div>
        <strong className="listing-title">{listing.title}</strong>
        <span className="muted">{listing.city}, {listing.state}</span>
        <span>
          <strong>{formatINR(listing.pricePerNight)}</strong> <span className="muted">/ night</span>
        </span>
      </div>
    </Link>
  );
}
