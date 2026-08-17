export function toPoint(lng, lat) {
  if (lng == null || lat == null || Number.isNaN(Number(lng)) || Number.isNaN(Number(lat))) {
    return null;
  }
  return {
    type: 'Point',
    coordinates: [Number(lng), Number(lat)],
  };
}

export function fromPoint(location) {
  if (!location?.coordinates || location.coordinates.length < 2) return null;
  return { lng: location.coordinates[0], lat: location.coordinates[1] };
}

export const geoPointSchema = {
  type: { type: String, enum: ['Point'] },
  coordinates: { type: [Number] },
};
