import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function StayMap({ location, title, address, city }) {
  if (!location?.lat || !location?.lng) {
    return null;
  }

  const position = [location.lat, location.lng];

  return (
    <div
      className="stay-map-container"
      style={{
        margin: '16px 0 24px',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}
    >
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '320px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {address}, {city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
