import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { coords } from '../utils/format.js';

export function MapView({ pickup, drop, current, height = 280 }) {
  const dropPos = coords(drop);
  const pickupPos = coords(pickup);
  const currentPos = coords(current);
  const center = currentPos || dropPos || pickupPos || [13.0827, 80.2707];

  if (!dropPos && !pickupPos && !currentPos) {
    return (
      <div className="grid place-items-center rounded-3xl bg-stone-100 text-sm text-stone-500" style={{ height }}>
        Live location is not available. Follow the delivery status instead.
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pickupPos && (
          <Marker position={pickupPos}>
            <Popup>Pickup</Popup>
          </Marker>
        )}
        {dropPos && (
          <Marker position={dropPos}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        {currentPos && (
          <Marker position={currentPos}>
            <Popup>Delivery partner</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
