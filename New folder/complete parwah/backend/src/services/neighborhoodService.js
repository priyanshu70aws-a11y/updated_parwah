const db = require('../models');
const { calculateDistance } = require('../utils/geoUtils');

const DEFAULT_RADIUS_METERS = 500;

const findNeighborhood = async ({ categoryId, latitude, longitude }) => {
  const neighborhoods = await db.Neighborhood.findAll({
    where: { categoryId, status: 'active' }
  });

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  for (const neighborhood of neighborhoods) {
    const distance = calculateDistance(
      lat,
      lon,
      parseFloat(neighborhood.centerLatitude),
      parseFloat(neighborhood.centerLongitude)
    );

    if (distance <= neighborhood.radius) {
      return neighborhood;
    }
  }

  return null;
};

const createNeighborhood = async ({ categoryId, latitude, longitude }) => {
  return db.Neighborhood.create({
    name: `Cluster ${new Date().toISOString()}`,
    categoryId,
    centerLatitude: latitude,
    centerLongitude: longitude,
    radius: DEFAULT_RADIUS_METERS,
    totalComplaints: 1,
    status: 'active'
  });
};

const assignNeighborhood = async ({ categoryId, latitude, longitude }) => {
  const existing = await findNeighborhood({ categoryId, latitude, longitude });

  if (existing) {
    await existing.increment('totalComplaints');
    return existing;
  }

  return createNeighborhood({ categoryId, latitude, longitude });
};

module.exports = {
  assignNeighborhood
};
