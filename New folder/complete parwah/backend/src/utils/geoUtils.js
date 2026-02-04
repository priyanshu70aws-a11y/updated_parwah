function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isNearby(lat1, lon1, lat2, lon2, thresholdMeters = 100) {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  let similarity = Math.max(0, 100 - (distance / thresholdMeters * 100));
  similarity = Math.min(100, similarity);
  
  return {
    distance: Math.round(distance * 10) / 10,
    isNearby: distance <= thresholdMeters,
    similarity: Math.round(similarity * 10) / 10
  };
}

function getBoundingBox(lat, lon, radiusMeters) {
  const latDelta = radiusMeters / 111000;
  const lonDelta = radiusMeters / (111000 * Math.cos(lat * Math.PI / 180));
  
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta
  };
}

module.exports = { calculateDistance, isNearby, getBoundingBox };