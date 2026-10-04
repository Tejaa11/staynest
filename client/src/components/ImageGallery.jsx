import { useEffect, useState } from 'react';

export default function ImageGallery({ images = [], title = 'Stay' }) {
  const [index, setIndex] = useState(0);

  const validImages = images.length > 0 ? images : ['https://placehold.co/800x500?text=StayNest'];

  const prev = () => setIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validImages.length]);

  return (
    <div className="gallery" tabIndex={0} aria-label="Image gallery">
      <div className="gallery-main" style={{ position: 'relative', margin: '16px 0 10px' }}>
        <img
          className="hero-img"
          style={{ margin: 0, width: '100%', height: '440px', objectFit: 'cover' }}
          src={validImages[index]}
          alt={`${title} - view ${index + 1}`}
        />
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-nav gallery-prev"
              onClick={prev}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-nav gallery-next"
              onClick={next}
              aria-label="Next image"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </button>
            <span
              className="gallery-counter"
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.65)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
              }}
            >
              {index + 1} / {validImages.length}
            </span>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div
          className="gallery-thumbs"
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {validImages.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              style={{
                padding: 0,
                border: i === index ? '2px solid var(--primary)' : '2px solid transparent',
                borderRadius: '6px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'transparent',
                flexShrink: 0,
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                style={{
                  width: '90px',
                  height: '60px',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: i === index ? 1 : 0.7,
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
